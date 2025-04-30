---
title: "RAG Chatbot: Vector Database"
date: 2025-04-30
description: A RAG chatbot using Qdrant and FastAPI
menu:
  sidebar:
    name: Chatbot with Vector Database and FastAPI
    parent: AI-Blogs
    identifier: Chatbot-Backend
    weight: 10
---

In a [previous blog](https://ahmadhamze.github.io/posts/ai/medical_chatbot/), I wrote about a RAG chatbot that I created using a dataset of medical questions and answers.

The RAG chatbot was embedding the user's question and retrieving the most relevant answers from an embeddings file, then GPT-4o-mini was used to generate the final answer using the retrieved answers.

In this blog, I will get rid of the embeddings file and use a vector database instead, then deploy the chatbot as an API using Docker and AWS.

### Why Vector Database?

Initially, I wanted to deploy the chatbot using the embeddings file, but I realized that this method is not scalable. The size of the file can get huge which means that retrieval will be slow and packaging the app will require more space.

Therefore, I decided to use a vector database instead, there are many options available, I chose [Qdrant](https://qdrant.tech/) because it is easy to use and has a free tier that is sufficient for experimental purposes.

## Building the Vector Database

In this section, I will redo what we did in the previous blog, but with a twist. We will not only embed the questions, but also the answers (more on that later), and instead of saving the embeddings to a file, we will save them to a Qdrant database.

> It is possible to run Qdrant locally using Docker, but I decided to use the hosted version instead.

After creating an account, you can create an API key to be able to connect to the database.

First, we need to initialize the Qdrant client:

```python
from qdrant_client import QdrantClient
from google.colab import userdata

# ---- Config ----
QDRANT_HOST = userdata.get("QDRANT_HOST")
QDRANT_API_KEY = userdata.get("QDRANT_API_KEY")
COLLECTION_NAME = "ruslanmv-ai-medical-chatbot"

# ---- Initialize Qdrant Client ----
client = QdrantClient(
    url=QDRANT_HOST,
    api_key=QDRANT_API_KEY,
)
```
> Notice that the code is supposed to run on Google Colab, this is to use a GPU later.

Once the client is initialized, we can create a collection to store the embeddings. You have to specify the name and the distance metric, also the number of dimensions of the embeddings.

In our case, we will use the `cosine` distance metric and the number of dimensions is 384, this is the dimension of the [all-MiniLM-L6-v2](https://huggingface.co/sentence-transformers/all-MiniLM-L6-v2) sentence-transformer model.

```python
# ---- Create Collection ----
if not client.collection_exists(collection_name=COLLECTION_NAME):
    print("Creating collection", COLLECTION_NAME)
    client.create_collection(
        collection_name=COLLECTION_NAME,
        vectors_config=models.VectorParams(
            size=384,  # Depends on your embedding model, all-MiniLM-L6-v2 is a 384 dimensional dense vector space
            distance=models.Distance.COSINE
        )
    )
else:
    print("Collection already exists")
```

Now, that we have a collection, we can load the dataset and embed the questions just like we did in the previous blog.

```python
from datasets import load_dataset
from sentence_transformers import SentenceTransformer

ds = load_dataset("ruslanmv/ai-medical-chatbot")

qa_pairs = [(entry["Patient"], entry["Doctor"]) for entry in ds["train"]]
questions, answers = zip(*qa_pairs)

# Initialize model with GPU
embed_model = SentenceTransformer("all-MiniLM-L6-v2", device="cuda")

# Process embeddings in batches
batch_size = 64  # Larger batch size for GPU
question_embeddings = embed_model.encode(
    questions,
    batch_size=batch_size,
    convert_to_numpy=True,
    show_progress_bar=True,
    device="cuda"
)
```

Now that the questions are embedded, we can insert them into the Qdrant database. However, unlike the previous blog, this time we
are trying to minimize the size of the code and the dependencies so that we can reduce the size of the Docker image.

That's why we will save the questions and answers in the database next to the question embeddings.
This way, we can retrieve the question and the answer together without needing to load the dataset like we did in the previous blog.

To populate the database, we will make post requests to the Qdrant API, the data will be batched to avoid hitting the API limits.

To insert or update data in Qdrant, we use `upsert` method:

```python
from qdrant_client.http import models

# Upload to Qdrant

"""
'answer' is needed in the payload, otherwise, finding the context will be harder and costly.
"""

for i in tqdm(range(0, len(questions), batch_size)):
    # Batching questions 
    batch_questions = questions[i : i + batch_size]
    # Batching answers
    batch_answers = answers[i : i + batch_size]
    # Batching question embeddings
    batch_vectors = question_embeddings[i : i + batch_size]

    points_batch = [
        models.PointStruct(
            id=i+j+1,
            vector=batch_vectors[j],
            payload={"question": batch_questions[j], "answer": batch_answers[j]}
            )
        for j in range(len(batch_questions))
    ]
    client.upsert(
        collection_name=COLLECTION_NAME,
        points=points_batch,
    )
```

The `PointStruct` constructs a Qdrant `Point`, the central entity in Qdrant, it represents a single point in the vector space. The "payload" is a dictionary that contains the metadata associated with the point, in our case, it contains the question and the answer, allowing us to retrieve them later.

> You can read more about `Points` in the [Qdrant documentation](https://qdrant.tech/documentation/concepts/points/).

This process might take a while, I remember it took around 40 minutes to finish. Also, note that after it finishes, the cluster overview page will show that the RAM and vCPU usage are off the charts, this is normal, the database needs some time to index the data.

After around 15 minutes, you should see a dashboard that looks like this (assuming you are using a dataset of the same size as the one used in the project):

![Qdrant Dashboard](./media/qdrant-overview.png)

Finally, we can embed a user's question and create a context using the retrieved questions and answers.

```python
def retrieve_context(query: str) -> str:
    nearest = client.query_points(
        collection_name=COLLECTION_NAME,
        query=embed_model.encode(query),
        limit=3
    )
    return "\n\n".join([f"Patient: {question}\nDoctor: {answer}" for question, answer in [(point.payload["question"], point.payload["answer"]) for point in nearest.points]])
```

The `retrieve_context` function will be used to give GPT-4o-mini the context it needs to generate the final answer.
