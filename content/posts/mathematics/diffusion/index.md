---
title: "From random walk to diffusion"
date: 2023-10-22
description: From random walk to diffusion
math: true
menu:
  sidebar:
    name: From random walk to diffusion
    identifier: mathematics-diffusion
    parent: Mathematics-Blogs
    weight: 1
---

Randomness is an interesting concept, we have seen in previous blogs how it can be harnessed to compute mathematical constants, and even create a universal computer. In this blog we will see how randomness can be used to model diffusion.
Diffusion can be defined as the movement of particles from a region of higher concentration to a region of lower concentration.
This is a common phenomenon, and can be observed in our daily lives. For example, when we add sugar to a cup of tea, the sugar particles diffuse throughout the tea.
Similarly, when we spray perfume in a room, the perfume particles diffuse throughout the room. In this blog we will see how we can model diffusion using random walks.

## Mathematical model of diffusion

Let's start by defining our problem mathematically, we will use a method known as descritization to model our problem.

Our world will be a two dimensional grid, particles exist inside the grid, and can move in four directions, up, down, left and right.
The particles will move in discrete time steps, at each time step, a particle can move in any of the four directions with equal probability, there is also the probability that the particle will stay in its current place without moving.
We will also assume that the particles cannot move outside the grid.

This picture gives us a visual representation of our model.

![Grid](./images/grid.png)
<p>
We track the walker (represented by the red dot) as it moves through the grid, during a time incrementation \( \Delta_t \), it has an equal chance of moving in any of the four directions (the blue arrows), or staying in its current position.
</p>
<p>
Therefore the probability of the walker moving in any direction is \( \frac{1}{5} \), and the probability of the walker staying in its current position is also \( \frac{1}{5} \).
</p>
<p>
The grid being square, we can assume that \( \Delta_x = \Delta_y \), so at each time step \( \Delta_t \), the walker may move a distance \( \Delta_x \).
</p>