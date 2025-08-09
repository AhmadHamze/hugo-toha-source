---
title: "ALB and an AWS alternative"
date: 2025-09-08
description: Using an ALB and deploying on Render.com
menu:
  sidebar:
    name: ALB and an AWS alternative
    parent: Infra-Blogs
    identifier: ALB-and-an-AWS-alternative
    weight: 10
---

In the previous blog [RAG Chatbot: AWS Deployment](https://ahmadhamze.github.io/posts/infra/chatbot_deployment/), we explored deploying a RAG chatbot using AWS ECS Fargate. In this blog, we will discuss how to use an Application Load Balancer (ALB) with our chatbot and also explore an alternative deployment option on Render.com.

## Application Load Balancer (ALB)

The app is deployed now with an IP address related to the running task of the ECS service, once that task is stopped or terminated, the IP address will change. To avoid this issue, we can use an Application Load Balancer (ALB) to provide a stable endpoint for our chatbot.

### Setting Up the ALB

First, just like we saw in the previous blog, make sure you already have the following:

1. An ECS Cluster
2. A running service using Fargate (you might need to recreate one that accepts an ALB)
3. The ECS task exposes port 8000 (or whatever port your application uses)
4. A VPC with at least two subnets in different Availability Zones (AZs)

### Creating the ALB

First, you need to create a **Target Group**:

1. Go to EC2 -> Target Groups
2. Click Create target group
3. Choose:
   1. Target type: IP
   2. Protocol: HTTP
   3. Port: 8000 (or whatever port your application uses)
   4. VPC: Select the VPC you created earlier
4. Click Next, skip registering targets for now
5. Name it `chatbot-api-tg`
6. Click Create target group

Now, to create the **ALB**:

1. Go to EC2 -> Load Balancers
2. Click Create Load Balancer -> Application Load Balancer
3. Set:
   1. Name: `chatbot-api-alb`
   2. Scheme: Internet-facing
   3. IP address type: IPv4
4. Select at least two public subnets in different AZs
5. Security Group:
   1. Either create a new SG or use the existing one
   2. Allow Inbound HTTP (port 80) from anywhere
6. Listener:
   1. Create a listener on HTTP:80
   2. Default action: Forward to `chatbot-api-tg`
7. Click Create Load Balancer

Once the ALB is created, you can update the ECS service to use it.

> You might not be able to add the ALB to the existing service because you might have set it this way in the beginning.
> In this case you will need to recreate the ECS service with the ALB configuration.

Whether you updated the existing service or recreated it, you have to setup the load balancer:

1. Select `Application Load Balancer`
2. Choose the ALB you created earlier
3. Listener: choose `HTTP: 80`
4. Target group: choose `chatbot-api-tg`, type: `ip`, and port: 8000
5. Health check path: User `/health` or any simple endpoint that returns 200 (e.g. `/`)

After setting up the load balancer, you should be able to access your chatbot using the ALB's DNS name.
The DNS name can be found in the AWS Management Console under the EC2 section, in the Load Balancers page, it looks like this:
`chatbot-api-alb-1234567890.eu-north-1.elb.amazonaws.com`

You can use this DNS name to access your chatbot through the ALB:

> In `.env`, set `CHATBOT_API_URL` to `http://chatbot-api-alb-1234567890.eu-north-1.elb.amazonaws.com/chat`

If all is good, you should now be able to access your chatbot through the ALB.
You can stop the task, then restart it, you will not need to update anything in the app.

### Note about the ALB

I got to admit this wasn't easy, following the above is actually hard if you're a beginner.
I stumbled a lot while setting this up, and I hope this guide helps you avoid some of the mistakes that I did.

For instance, I had to recreate the ECS service because I couldn't find the ALB configuration when editting.
I also somehow ended up creating two load balancers and trying to use the one that is not attached to any service, which was a waste of time.

So, if you find the above difficult to follow, or simply unclear, don't worry, this is completely normal.

## Deploying on Render.com

After all this AWS setup, I got exhausted and I was feeling a great appreciation and admiration for the AWS wizards that
I've worked with.
I didn't like how costly AWS was neither, so I started looking for alternatives.

That's how I discovered [Render.com](https://render.com/).

> No, I'm not sponsored by them, although I wish that was the case!

This platform is amazing, it is much easier to deploy applications compared to AWS, it also has a free tier that allows you to test deploying your applications without any costs whatsoever.

It also solves the problem that necessitated the use of an ALB in the first place.
Because Render generates a unique domain for each service, you don't need to worry about setting up a load balancer manually.

### How to deploy on Render.com

1. Sign up for a free account on [Render.com](https://render.com/).
2. Create a new web service.
3. Connect your GitHub repository containing the chatbot code.
4. Set the build command (if needed) and the start command (e.g., `python app.py`).
5. Set the environment variables, such as the AI API keys and the database connection string.
6. Choose the free plan and click "Create Web Service".

Render will automatically handle the deployment, and you will get a unique URL for your service.
If anything goes wrong during deployment, the logs are quite easy to understand, if you could handle AWS, Render will feel like a child's play.

## Conclusion

In this guide, we covered how to set up an Application Load Balancer (ALB) on AWS for your chatbot application, and how to deploy the same application on Render.com.
While AWS provides powerful tools for managing your infrastructure, it can be complex and challenging for beginners.
Render.com offers a simpler alternative that abstracts away much of the complexity, allowing you to focus on building your application.
