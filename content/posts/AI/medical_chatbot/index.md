---
title: "RAG Medical Chatbot"
date: 2025-04-09
description: A medical chatbot using RAG
menu:
  sidebar:
    name: Medical Chatbot
    parent: AI-Blogs
    identifier: Medical-Chatbot
    weight: 10
---

A few years ago, when I started delving deeper into programming, AI was one of the main topics that captivated my interest.

It was only natural for me to stumble upon this subject, since I was drawn into scientific programming and Python. Back in the day,
AI wasn't the hype as it is today, most importantly, when it was mentioned to the public, it was associated with different domains, not just LLMs as it is today.

Most people at some point of their lives tried to play chess with a computer, this was (and still is) a great example of AI.
Chess engines do not "memorize" every single possible move, but they are able to calculate the best possible move based on the current state of the game.
Many other example of AI existed, we had image classification, object detection, recommender systems, etc.

One form of AI which was not so popular was Natural Language Processing (NLP), I remember using some NLP systems a few years ago, and they were quite impressive, they could answer questions, they could translate text, and they could even tell you how is the person writing the text feeling.

## Here comes ChatGPT

On November 30, 2022, OpenAI released ChatGPT, a chatbot that was able to answer questions in a conversational way.
It took the world by storm, including my own software development "bubble", I would ask ChatGPT to build a React component, and it
would actually do it correctly!

A few months later, I have something called GitHub Copilot, which was able to suggest code while I was writing it in VSCode.

The past two years saw incredible advancements and changes in software development and AI. There are now countless AI tools, there are AI agents, Vibe coding is a thing, lots of courses about "prompt engineering", and so on.

## Using an LLM to create something

Naturally, I wanted to create something using an LLM, after all, everyone is talking about it, and I wanted to be part of the hype.

To be fair, I couldn't come up with an original idea, everyone seems to be doing the same thing, that is building chatbots using an API for an LLM.

These chatbots basically use a context which might not be available for the LLM, use a combination of tools to find relevant context in a quick and efficient way, and finally utilize the LLM to generate a response based on the context and the question asked by the user.

One useful method to create chatbots is called RAG which stands for Retrieval-Augmented Generation, it adds new information to the LLM instead of randomly dumping data in the context-window, making it more efficient.
Giving an LLM context about something decreases the chances of "hallucination", which is a term used to describe the fact that LLMs are not always correct, and they can generate false information.

RAG is created in four steps:

1. **Parsing**: preparing the data, and transforming it into a format that can be used by the LLM.
2. **Ingestion**: creating the knowledge database from the processed data.
3. **Retrieval**: finding the relevant information from the knowledge database.
4. **Generation**: using the LLM to generate a response based on the retrieved information.

## A medical chatbot

Googling something about your health is probably not the best idea, Google has the habit of telling you that you have cancer when you have a headache.
LLMs are probably not better than Google, after all, they got their information from the internet, however, suppose you do have an extensive dataset of medical information that is approved by doctors, why not use this data to create a medical chatbot?

Right from the beginning, you can see that one of the hardest parts is to actually find such a dataset, medical information can be found in PDF files, books, online, etc. More importantly, the data can be textual, visual images, videos, etc.

Lucky for me, I am not building a serious medical application, so I ended up using a simple dataset from Hugging Face, which is a collection of medical questions and answers.
You can find the dataset [here](https://huggingface.co/datasets/ruslanmv/ai-medical-chatbot).

### Parsing

The dataset is a `Dataset` object, which is a class from the `datasets` library, provided by Hugging Face. It contains a collection of medical questions and answers, which is perfect for our use case.

The parsing step will be very easy, we will just convert the dataset into a list of tuples, where each tuple contains a question and an answer.

```python
from datasets import load_dataset

ds = load_dataset("ruslanmv/ai-medical-chatbot")
qa_pairs = [(entry["Patient"], entry["Doctor"]) for entry in ds["train"]]
questions, answers = zip(*qa_pairs)
```

This code gives two lists, one with the questions and one with the answers, both lists indices correspond to each other.

### Ingestion

In this step, the "AI" will learn from the data, it will create a knowledge database that will be used to retrieve relevant information.

First, we need a model to encode the questions, Hugging Face offers many models for this task, I ended up using `all-MiniLM-L6-v2`, which is a small model that is fast and efficient, you can read about it [here](https://huggingface.co/sentence-transformers/all-MiniLM-L6-v2).

What this basically does is that it converts sentences into multi-dimensional vectors, these vectors can be clustered together, creating a space where similar sentences are close to each other.

#### Using a GPU

It is best to use a GPU for this task, since it is much faster than using a CPU. You can use Google Colab or any other cloud service to get access to a GPU.
The downloadable dataset size is 142 MB, it gets larger when you load it into memory, but still, this is not considered big in any way.
On my very humble normal computer, the CPU would take one and a half hours to process the dataset, while the GPU on Google Colab took only 10 minutes.

#### Saving the embeddings

The embeddings are the vectors that are created by the model, they are used to find similar sentences. In serious applications, you would want to save them to a vector database, such as Pinecone, Weaviate, or ChromaDB. However, for this simple example, we will just save them to a numpy file.

This is the code, notice that is it using a GPU:

```python
from sentence_transformers import SentenceTransformer

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

# Save embeddings to avoid recomputing
np.save('question_embeddings_gpu.npy', question_embeddings)
```

Once you have the embeddings file, you can download it and use it in your local machine, or you can just run the code on Google Colab and use it there.

> Note: do not download the file directly from Colab, instead, copy it to Google Drive and download it from there, it is much faster.

### Retrieval
In this step, we will use the embeddings to find the most similar question to the one asked by the user. We will use the `faiss` library for this task, which is a library for efficient similarity search and clustering of dense vectors.

What happens in retrieval is this:

1. A question is encoded using the same model that encoded the questions in the dataset.
2. The encoded question is used to find the most similar questions in the dataset using the `faiss` library.
3. The most similar questions and answers are returned as a context.


```python
import faiss
import numpy as np
from sentence_transformers import SentenceTransformer

embed_model = SentenceTransformer("all-MiniLM-L6-v2")
question_embeddings = np.load(EMBEDDINGS_PATH)

# Store embeddings in FAISS for fast retrieval
dimension = question_embeddings.shape[1]
index = faiss.IndexFlatL2(dimension)
index.add(question_embeddings)

def retrieve_context(user_query, top_k=3):
    """Finds the 3 most relevant stored questions and their answers"""
    query_embedding = embed_model.encode([user_query], convert_to_numpy=True)
    _, indices = index.search(query_embedding, top_k)
    
    retrieved_context = "\n\n".join([f"Patient: {questions[i]}\nDoctor: {answers[i]}" for i in indices[0]])
    return retrieved_context
```

### Generation

This is the final step, all what we need to do here is use an LLM to generate a response based on the context we retrieved in the previous step.

The code is simple, I will not be putting it here, however, you should know that you have to specify to the model that you don't want it to use its knowledge to answer you questions. Only use the context that you provided, this is important because without it you won't even notice that the context is used.

Finally, I used gradio to create a UI for the chatbot, you can find the complete code on this [repo](https://github.com/AhmadHamze/Q-A-Chatbot), do check it out.

## Conclusion

This is a simple example of how to create a medical chatbot using RAG. The code is not perfect, and it can be improved in many ways, LangChain is a great library that can help you with this task, and it is worth checking out.

The dataset can be improved, think about adding images, videos, and other types of data. You can also use a more complex model to encode the questions, or even use a different model for each type of data.
