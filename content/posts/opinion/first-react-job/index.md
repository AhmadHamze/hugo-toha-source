---
title: "Lessons Learned From My First Web Dev Job"
date: 2021-05-27
description: Things I Learned From My First Web Dev Job
menu:
  sidebar:
    name: Web Dev Learned Lessons
    identifier: First-Web-Dev
    parent: Opinion-Blogs
    weight: 10
---

Recently I started a web development job as a front-end developer, here are a few things I learned so far.

## 1. Make sure to have the correct working environment

As you might know, preparing the development environment is an essential step when you start a new project. In my case, the team decided to
use [Nix](https://nixos.org/) for package management (it's awesome). The first problem I faced is that I am using Windows,
and to be able to
use nix on Windows you have to use [WSL](https://docs.microsoft.com/en-us/windows/wsl/about). You might be wondering why I didn't use WSL2
or why not just use Linux instead of Windows? The answer is I simply did what seemed to be the easiest choice, and that was using WSL.

Unsurprisingly, I regretted doing this when suddenly I couldn't access the nix environment anymore after we had to upgrade the nix version.

I tried to find a solution to this problem (which I shouldn't be wasting my time on) and I lost a whole day
without solving it. All of this could be avoided by using Linux instead of Windows, I paid the price of being hasty when choosing the right
working environment.

## 2. How you use Git makes a difference

By far the most important skill I acquired is using Git with a team. Before I started working on this project I never used Git in a team,
it turned out that the way you name your branch can improve the communication with your teammates, for example starting the branch name
with the issue number related to this branch is a great way to tell your teammates what they should be expecting when reviewing your code.

Something worth noting for all beginner developers, you should know that you will not be good with git unless you use it with a team
(I know, that's why Git was made!). You probably tried merging some branches and resolving some deliberately made conflicts for 
learning purposes, that's great but beware, it's not going to be easy at the beginning in a real-world situation.

## 3. React with Typescript

We decided to use React with Typescript for the front-end, I have to admit that I wasn't quite ready to use it when I started the project,
but eventually, I understood how important it can be.

Creating interfaces for your react components is extremely useful, it serves as a self-documenting process that will help you in the future
when you need to go back to the code. Not to mention that having compilation errors is a much better way to fix the problems in your code,
when using Javascript it's much harder to figure out where things went wrong.

Typescript makes you type more, however, it's worth it.

## 4. Storybook

At first, [Storybook](https://storybook.js.org/) seemed rather strange to me, why would I need to create a story for each component
that I create? Isn't this a bit excessive?

Well, Storybook is the best way to document the UI, all components can be shown in isolation. I also found myself doing manual testing for
my components on Storybook, having them isolated one by one made my job much easier when it came to testing responsiveness.<br>
Storybook also improved the communication between the team and the client who would suggest making improvements based on it.
In addition, it helped to ensure the client of the workflow in earlier stages of development.

## 5. Material UI

[Material-UI](https://material-ui.com/) is probably one of the most famous React libraries, using it was quite fun and easy.<br>
If you're a beginner, I would suggest that you take some time to learn how breakpoints work, this will save you a lot of time when
building responsive components.

Material components are easy to learn and generally easy to modify, however, you need to pay close attention when modifying material themes.<br>
Suppose you're modifying the default button component, If you find yourself going too deep into the props to change a minor
property, chances are that you're probably wasting more time than you're supposed to.<br>
Material components are highly customizable, this is a good thing however, you could easily fall into a rabbit hole
if you're not paying close attention at the time.

# Final words

Web development is a huge discipline, many technologies are out there and they keep changing at a rapid pace. When you start working
on a web dev project, be prepared to learn new things, stay focused on the deadline, and remember that communication will make the project
or break it.