
---
title: "Enhancing Recursion with Memoization"
date: 2022-04-17
description: Enhancing Recursion with Memoization Using Fibonacci
math: true
menu:
  sidebar:
    name: Recursion with Memoization
    parent: Algorithmics-Blogs
    identifier: Recursion-with-Memoization
    weight: 10
---

In this blog, we will go over an example of recursion and how we can use something called memoization to increase the
speed of the code.

## The Fibonacci Sequence

If you've never heard of it, it's quite simple, just start with two numbers 0 and 1, and add them together to get the next number in the sequence (yeah, that'll be 1 once again).

Now add the new number with the one just before it to obtain the next number, so 1 + 1 and that is 2.

| n     | Fib(n)        |
| :---  |    ---:       |
| 0     | 0             |
| 1     | 1             |
| 2     | 1             |
| 3     | 2             |
| 4     | 3             |
| 5     | 5             |
| 6     | 8             |

You can keep doing that indefinitely, our goal is to study the algorithm that computes the values of this sequence.

> Discover more about the sequence on this [wiki](https://en.wikipedia.org/wiki/Fibonacci_number).

### Simple Recursion

Recursion comes into mind when dealing with such a problem, after all the definition of the sequence is itself recursive, so let's write a Python function that computes the nth value of the sequence.

```python
def fib_rec(n):
    if n == 0 or n == 1:
        return n
    return fib_rec(n - 1) + fib_rec(n - 2)
```

The code above is imitating the sequence verbatim, if the input is 0 or 1 return the input itself, otherwise, return the sum of the previous element and the one before it.

> You can test this code quickly on [myCompiler.io](https://www.mycompiler.io/new/python), it's an online code editor that allows you to run code using different programming languages.

Let's test the function, try __fib_rec(10)__, you should get 55 pretty quickly.
Then try __fib_rec(30)__, you should get 832040, but you will notice that the result took more time to be printed.

If you try __fib_rec(40)__ on myCompiler.io, you might get the following message _[Execution timed out after 10 seconds]_. This means that the website stopped running the code because it took too much time.

You might be thinking, well that might be normal, there are things out there that just need time, the Fibonacci sequence is probably one of those.

### Non-Recursive Approach

Look at the following code then

```python
def fib(n):
    if n == 0:
        return n
    a, b = 0, 1
    for _ in range(n - 1):
        a, b = b, a + b
    return b
```

Instead of using recursion, we're just using a for loop to add the last two sequences together, and updating the values to always get the latest two elements of the sequence.

Let's try this function, __fib(40)__ returns 102334155 almost instantly! Why don't we create a function to measure the time taken by both functions to compute values.

```python
import time

def fib_time(func, arg):
    start = time.perf_counter()
    # Call the method with the argument
    func(arg)
    end = time.perf_counter()
    return f"Took {end - start} seconds"
```

First, let's see how fast __fib_rec__ is when passed the value 30.

```python
print (fib_time(fib_rec, 30))
```

It takes __3.06 seconds__, needles to say __fib__ is much faster, how much faster? Well, we can simply try passing larger values and see when it takes 3 seconds to finish.

Turns out the value is 215,000! That is 7167 times faster!

## Why bother with recursion

You might be thinking, why did I waste your time? I could've just shown you the non-recursive version and been done with it.

Indeed, when it comes to Fibonacci, recursion is not the best way to go, the code is faster and I would even argue that it's simpler especially if you don't use recursion often.

However, sometimes you might have to use recursion, and there are ways to make it faster.

### Why was it too slow

Let's look back at the recursive code and see what is the problem. What's going on is that a lot of values are getting computed.

E.g. to compute __fib_rec(10)__ you would have to compute __fib_rec(9)__ and __fib_rec(8)__, each of which will also have to call two fibs once again, and so on. That is a lot of computation, what's even worse is that most of the values are being recomputed so many times.

> It takes 54 addition operations to compute __fib_rec(10)__, try to find out how to figure this out

## Memoization to the rescue

The code would be faster if we could somehow store the values instead of recomputing them over each time.

That is memoization, in short, simply store the previous results in a cache, this is a net win if maintaining the code is cheaper than recomputing.

We will create a recursive memoized function and see how well it fairs in terms of speed.

### Building a memoized function

We want a function that stores each argument for the Fibonacci sequence alongside its value, An array will store these pairs.

A helper function will be used to check if the passed value exists inside the storage.

```python
# takes an element and a list of pairs, if the element is equal to the first part of a pair,
# return the second part, otherwise return false
def check_value(element, pairs):
    for (p1, p2) in pairs:
        if element == p1:
            return p2
    
    return False
```

Now, the memoized recursive Fibonacci sequence

```python
def fib_memo():
    # the cache, it starts empty, it will contain elements that looks like this (n, Fib(n))
    memo = []
    # This computes Fibonacci recursively just like we've seen before, however, the difference is
    # that it checks if the argument exists inside the memo array, if it does, the corresponding value
    # will be returnd instead of recomputing
    def f(n):
        ans = check_value(n, memo)
        if ans:
            return ans
        else:
            new_ans = n if n == 0 or n == 1 else f(n - 1) + f(n - 2)
            # insert the new pair at the beginning of the array, this makes the code faster
            memo.insert(0, (n, new_ans))
        # return the answer that was just computed
        return new_ans
    # fib_memo() is returning the function f 
    return f
```

> Notice that fib_memo returns a function, so to get the Fibonacci value, you will have to call it this way `fib_memo()(n)`

We're done, let's check if this works, how about we try 10,000. To do so we need to increase the default recursion depth in Python.

```python
import sys
# Increase the recursion depth
sys.setrecursionlimit(100000)

print (fib_time(fib_memo(), 10_000))
``` 
<p>
This takes around 0.28 seconds!
This function is incredibly fast, using memoization a function that takes 
\( O(2^n) \) will now take \( O(n) \).
</p>


## Final words

Memoization can make your recursive function way faster, make sure to use it when necessary.

The example above is just a demonstration of memoization, the non-recursive version is the best option here,
it is faster and does not require lots of memory, unlike the memoized version.