---
title: "RAG Chatbot: Vector Database & Deployment"
date: 2025-04-29
description: Deploying a RAG chatbot
menu:
  sidebar:
    name: Chatbot Backend
    parent: Infra-Blogs
    identifier: Chatbot-Backend
    weight: 10
---

In a [previous blog](https://ahmadhamze.github.io/posts/ai/medical_chatbot/), I wrote about a RAG chatbot that I created using a dataset of medical questions and answers.

The RAG chatbot was embedding the user's question and retrieving the most relevant answers from an embeddings file, then GPT-4o-mini was used to generate the final answer using the retrieved answers.

In this blog, I will get rid of the embeddings file and use a vector database instead, then deploy the chatbot as an API using Docker and AWS.

## Why Vector Database?

Initially, I wanted to deploy the chatbot using the embeddings file, but I realized that this method is not scalable. The size of the file can get huge which means that retrieval will be slow and deploying the app will require more resources.

Therefore, I decided to use a vector database instead, there are many options available, I chose [Qdrant](https://qdrant.tech/) because it is easy to use and has a free tier that is sufficient for experimental purposes.

### Qdrant

It is possible to run Qdrant locally using Docker, but I decided to use the hosted version instead. To populate the database, I will make post requests to the Qdrant API.

Then, I will use the API to retrieve the most similar embedding to a given embedded question.
