---
title: "Reflections on Changing Jobs"
date: 2025-02-02
description: Changing Jobs and Tech Stacks
menu:
  sidebar:
    name: Changing Jobs and Tech Stacks
    identifier: Job-Change
    parent: Opinion-Blogs
    weight: 10
---

After a long pause, here I am writing a blog post once again. Recently, I got distracted by many things, and I fell into a cycle of procrastination, but arriving late is better than never.

I am now working with a new team and with a new tech stack, at the time of writing this post, I have been working with them for about 8 months.
This gave me more than enough time to reflect on the changes that happened in my life.

I want to approach this from two sides, work culture, and tech stacks.

## Fast pace, daily standups, growing team

These three things are the first things that come to my mind when I remember the old job. It is important to note that I only began to feel this way after switching to the new role.

What do I mean by fast pace? Well, in the old job, we had to deliver features quickly, and we had to be ready to change the direction of the project at any time. This was a good thing, it made me learn how to adapt to changes quickly, and it made me learn how to work under pressure.

Fast pace is not just about writing code quickly, it's also not just learning and trying new packages, it's a mentality.

It is about expecting your pull request to be merged hours after you open it, it's about writing tests only when you have to, and most importantly it's about being ready that your role might change at any time.

You're writing styling React components today, tomorrow you might have to create Django models, APIs, and even deal with some Pandas dataframes.
Be ready to focus on UX for a few days, then come back to writing Cypress tests, and because lots of pull requests are getting merged, be ready to have to fix something that someone else broke by mistake.

Some people don't like daily standups, but when you're working in such an environment, daily standups are needed. It's the only way to know what's going on, and it's the only way to know what you should be working on.
You have to pay attention to what your teammates are saying, this is harder than it seems, because when things become a habit, you automatically let your guard down.

On top of that, the team was growing, and it was growing fast. I remember when I joined the team, we were only four developers, and by the time I left, we were ten.
Responsibilities were changing quickly, communication and planning were becoming harder, and it became quite difficult to keep up with all the changes.

### What I learned from this

First, it is ok to get tired and to feel overwhelmed, you are not going to be motivated every single day, and your interests will change over time. There is nothing wrong about that, it's just a sign that you need to change something, it might lead you to a better position or to a worse one, but it has to be done.

Second, the team size matters, you cannot work with ten people just like you work with four, don't wait for management to take actions on this matter. Do it yourself, they probably don't have the same problems as you do, so if you don't mention it, they won't know about it.

Finally, burnout is definitely a thing, it's not lazy people complaining about their jobs, ideally, you should see it coming and avoid it before it's too late.

How do you know you're burning out? You start to feel tired all the time, you don't want to work on your projects anymore, you don't want to learn new things, and you don't want to talk to your teammates.

Here are some suggestions to avoid it:

1. Take a break before you're too tired, it doesn't have to be a one month vacation, one week is enough, you can do a lot in one week away from work. Don't fall in the trap of "I'll take a break next month", that's nonsense, do it now.
2. Tell your boss that you're not feeling ok, whether you're falling behind or you're just not enjoying work like before, just have the courage to say it. Courage is not about not being afraid, it's about doing something that you're afraid of.
3. As a software developer, if the only place you're interacting with code is in your job, that's a sign that you're already deep in the rabbit hole, it's time to get out. Start something on the side, whether it's a project, taking a course, or learning a new language for fun, you have to do it. Take a break from your job and do this, it will help you a lot.

## Best practices, less communication, designs

Here I am at the new job, my first impression is "it is so different from the old job". I am not saying it's better or worse, it's just different.

I am back to a small team, however, unlike before, there are much less pull requests and each one of them spends a lot of time getting reviewed.
Almost, nothing gets merged unless changes are requested a few times at least.

Reviews are not just about the code, what kind of types you added, the components, or the functions you wrote, it's also about the design, the architecture, and the best practices.

Why do you add a file? Why did you name it such? Why is it in this folder not the other? Why didn't you refactor the code before adding this feature? Why didn't you write tests for this? And much more.

Be prepared to answer these questions, and be prepared to get back to your old branch from two weeks ago because it turns out it is not done yet.
Oh, and the daily standups, no such thing anymore, this doesn't mean that you can relax and do whatever you want, it means that you have to be more responsible and more independent.

When a meeting comes, you have to know what to say and what not to say, you have to be prepared before coming into the meeting, both in terms of what you want to say, and what you want to hear.

Having a bad meeting means that you have to wait for another week to have another one, and you don't want that.

Something that I didn't have the chance to experience before is following a UI/UX design.
I expected that it is going to be straightforward, after all, what is so hard about following a design? Well, it turns out that my styling skills are not as good as I thought they were.

Making a component look exactly like the design does not happen by copying the CSS from the design file, it's about understanding the design, understanding the CSS, and understanding the component you're working on.

We are using Figma, and it's a great tool, It serves well as a communication tool with the designer and the product manager, I am lucky that I found a way to communicate other than meetings, Figma ended up serving a purpose I didn't expect.

## Tech stacks

I used to work with React and Django, before moving into the new job, I knew that I will be working with React Native and NodeJS.
I was worried for a few days before starting because I didn't have the time to prepare, I had a very brief introduction to React Native and NodeJS, and I was expected to contribute to the project from day one.

Once I started working, I was relieved, React Native is really just React for the most part, the things that are special to React Native are not needed in most cases, so it feels you're just doing React with a slight difference in syntax.

NodeJS and GraphQL weren't that hard to grasp either, but they made me appreciate Django even more.
I didn't know how simple Django is until I started working with Node.
The main difficulty is that you have to think about SQL queries when working with Node, Django abstracts the SQL part for you, and you don't have to worry about it.

Sure, you can write SQL with Django if you want to, but I never had to do it before, and that is a proof of how good Django is.

Fundumentally, changing the tech stack didn't feel like a big deal, I realized that I can learn any tech stack in a few weeks.
I am hoping that this is a sign of "growing up" as a developer, I don't need to watch tutorials anymore, I can just figure things out on my own and learn from the documentation directly, AI also helps alot obviously.
I couldn't do that before, so I guess I am improving.

### Building the app

That being said, a major difference between working with React and React Native isn't related to coding at all, it's about the environment.

You are not running React Native in a browser, you're supposed to run it on a mobile device, which can be an Android or an iOS device.
I don't use a Mac, so I had to use an Android emulator to emulate an actual device, this was new groud to me.

You have to build the app and install it on the emulator, to build it we use a tool called Gradle. 
A lot can go wrong when building the app, incompatible libraries, missing dependencies, and much more.
I had to spend the first few days just trying to build the app, I eventually succeded but it was a painful process.

Many accidents happened later, whenever a big change is made, I have to build the app again, and I have to make sure that it works on both Android and iOS.
With time I became more comfortable with the process, but it still causes anxiety whenever I have to do it.

Debugging is another subject that feels different, the browser is just easier to use for that purpose.
React Native does offer ways to debug the app, but it's not as good as the browser, and it's not as easy to use.

## Final thoughts

Enjoy the moment whatever it is, and remember whatever you're doing, there will be a time when you do it for the last time, and it might happen suddenly.
So just enjoy the ride and don't stress too much about what's going to happen, change is coming for better or worse.

Try your best to adapt to changes, keep learning and explore new domains, you never know what you might find interesting.

That's it for today, let's hope I won't take another long pause before writing another post.