---
title: "RAG Chatbot: Deployment"
date: 2025-05-12
description: Deploying a RAG chatbot with AWS ECS Fargate
menu:
  sidebar:
    name: Chatbot Deployment
    parent: Infra-Blogs
    identifier: Chatbot-deployment
    weight: 10
---

In a [previous blog](https://ahmadhamze.github.io/posts/ai/qdrant_chatbot/), we created a RAG chatbot using Qdrant, and FastAPI. In this blog, we will deploy the chatbot as an API using Docker and AWS.

## What does it mean to deploy an application?

Deployment is the process of making an application available for use, this does not necessarily mean that the application is in production.
Deployment can be done in different environments, such as development, staging, and production. In this blog, we will deploy the chatbot in a staging environment using Docker and AWS.

Staging is an environment that is similar to production, but it is not accessible to end users.
Developers and testers can use the staging environment to test the application before it gets deployed to production, this allows developers to catch any bugs or issues before they affect the end users.

## Deployment friendly code

The first step is to make sure that the code can run correctly wherever it is deployed. In our case, we have a chatbot that is using multiple API keys to connect to different services. We need to ensure that these keys are available in the environment where the code is running.

One way to do so is by using environment variables, we already have a `.env` file that contains the API keys, however, this is not the best way to store secrets in production.

### AWS Secrets Manager

In this blog, we will use AWS Secrets Manager to store the API keys and load them in the code.

Creating secrets is straightforward, just go to "AWS Secrets Manager" -> "Store a new secret", and select the type of secret you want to store.
In our case, we will use the `Other type of secrets` option, and add the keys as key-value pairs, e.g. QDRANT_HOST: `https://your-qdrant-host`, QDRANT_API_KEY: `your-qdrant-api-key`, etc.

Then, name your secret, e.g. `qdrant-medical-chatbot-secrets`, and select the encryption key (you can leave it as default).

Now that the secret is stored, we can use it in our code, to do so, we need to change the code from using the `.env` file to using the AWS Secrets Manager.

This is why we need to use the `boto3` library, this is a Python library that allows interacting with AWS services, including Secrets Manager.
We will use the `get_secret_value` method to retrieve the secret value, and then we will load it into variables.

```python
import boto3
import json

def get_secret(secret_name, region_name="eu-north-1"):
    # Create a Secrets Manager client
    session = boto3.session.Session()
    client = session.client(
        service_name="secretsmanager",
        region_name=region_name
    )
    try:
        response = client.get_secret_value(SecretId=secret_name)
        if "SecretString" in response:
            return json.loads(response["SecretString"])
        else:
            # Binary secrets handling if needed
            return json.loads(response["SecretBinary"].decode("utf-8"))
    except Exception as e:
        print(f"Error retrieving secret {secret_name}: {e}")
        raise

# Get secrets from AWS Secrets Manager
# You can store all related secrets in one secret with multiple key-value pairs
secrets = get_secret("qdrant-medical-chatbot-secrets")

GPT_4o_MODEL = "openai/gpt-4o-mini"
client_4o = OpenAI(base_url="https://openrouter.ai/api/v1", api_key=secrets["GPT_4o_API_KEY"])

QDRANT_HOST = secrets["QDRANT_HOST"]
QDRANT_API_KEY = secrets["QDRANT_API_KEY"]
HUGGING_FACE_API_KEY = secrets["HUGGING_FACE_API_KEY"]
COLLECTION_NAME="ruslanmv-ai-medical-chatbot"
```

> Do not forget to add the `boto3` library to `api_requirements.txt` file

