---
title: "My first C++ console application"
date: 2021-07-29
description: Explanation of the C++ matrix application
menu:
  sidebar:
    name: Simple C++ matrix calculation
    identifier: Simple-C++-Matrix
    parent: Mathematics-Blogs
    weight: 10
---

# Matrix calculator for two by two and three by three real matrices

This is a project that I did around three years ago, just after I finished taking my very first comprehensive programming course, it was about the C++ language.

Back then I knew that there are many better options to do matrix calculation, mostly using the Python Numpy library.
I also knew that there are many C++ libraries that provide matrix calculation, most notably [Eigen](https://eigen.tuxfamily.org/index.php?title=Main_Page).

However, I wanted to try doing matrix calculations by myself. I used Numpy during my studies at the university, and back then I wasn't capable of understanding the source code.
I also felt that looking at the answer without first trying myself is counterproductive, this is why I started doing this project.

It's important to know that there is a much better way to design this program, now that I am more experienced with C++ I would have used the STL library instead.
The `std::vector` is quite easy to use and will allow for much more advanced matrix operations.


## Design

This program is a console application that can add, multiply and invert 2 by 2 and 3 by 3 real matrices.
It has error checking and it keeps running until the user quits.

In this blog I will be mostly explaining the design of the application rather than showing how it's used, if you want to use it please check the [project's page](https://github.com/AhmadHamze/Small-Matrix) on Github and take a look at the Readme file.

### Code Seperation

The code is separated into three files:
1. The header file `Matrix.h`,
it contains the declaration of the classes and their respective constructors, attributes, and methods.
2. `matrix.cpp` is where you find the definition of all the constructors, methods, and operator overloading.
3. `main.cpp` is the main file that runs the application.

### Object Oriented Program

As a beginner, I wanted to implement all the object-oriented principles that I learned, especially inheritance and operator overloading. This was implemented in the design of the matrix.

I started by creating a class called `Matrix2by2` which as the name suggests, is the class that creates a 2 by 2 matrix.

It has the following attributes:

1. `q`: an array of floats of length nine used to store the matrix.
2. `p`: an array of floats of length nine used to save the operations performed on the matrix.
3. `r`: an array of floats having a 3 by 3 dimension used to perform the multiplication operations.
4. `isPrintable`: a boolean determining if the matrix can be printed.

You're probably thinking why have nine floats for a matrix of size 2 by 2? It's because I will be inheriting these properties to use them in the class `Matrix3by3`, this class creates the 3 by 3 matrices.

We also have two constructors:

1. `Matrix2by2()`: initializes all the arrays to zero and sets `isPrintable` to true.
2. `Matrix2by2(float*)`: convert constructor, used to simplify the process of creating a matrix.

Here is the code for both constructors respectively:

```c++
    Matrix2by2::Matrix2by2()
    {
        isPrintable = true;
        for (short i = 0; i < 9; i++)
        {
            q[i] = 0;
            p[i] = 0;
        }
        for (short i = 0; i < 3; i++)
        {
            for (short j = 0; j < 3; j++)
            {
                r[i][j] = 0;
            }
        }
    }

    Matrix2by2::Matrix2by2(float* q)
    {
        for (short i = 0; i < 4; i++)
        {
            this->q[i] = q[i];
        }
    }
```

We have two operators overloaded, the `+` and `*`, these are used to add and multiply two matrices.

Here is the code for both operators:

```c++
    // Overloading the '+' operator to add two by two matrices
    Matrix2by2 Matrix2by2::operator+(Matrix2by2 M)
    {
        for (short i = 0; i < 4; i++)
        {
            p[i] = this->q[i] + M.q[i];
        }
      M = p;
      M.isPrintable = true;
      return M;
    }

    // Overloading the '*' operator to multiply two by two matrices
    Matrix2by2 Matrix2by2::operator*(Matrix2by2 M)
    {
        for (short i = 0; i < 4; i += 2)
        {
            for (short j = 0; j < 2; j++)
            {
                r[i][j] = this->q[i] * M.q[j] + this->q[i+1] * M.q[j+2];
            }
        }
        p[0] = r[0][0];
        p[1] = r[0][1];
        p[2] = r[2][0];
        p[3] = r[2][1];
        M = p;
        M.isPrintable = true;
        return M;
    }
```

After seeing the code, hopefully, you can start to understand the necessity of each attribute as well as how they simplify the code.

We have three methods:

1. `void setMatrix()`: used to set the matrix received from the user input, this is where error handling is done.
2. `void getMatrix()`: used to print the matrix on the console, if allowed.
3. `float* invertMatrix()`: used to create the inverse of the matrix if possible.

We will go over the `setMatrix()` method because this is where the error handling is made, I think this is the strongest aspect of the application.

The main idea of this method is to not accept any matrix that has a non-floating number, it also makes sure to
accept only the needed numbers from the user and ignore all excessive numbers in case they were provided.

This is the code:

```c++
    void Matrix2by2::setMatrix()
    {
        cout << "Enter the 2 by 2 matrix\n";
        short counter = 0;
        do {
            for (short i = 0; i < 4; i++)
            {
                if(!(cin >> q[i]))
                {
                    cin.clear();
                    cin.ignore(numeric_limits<streamsize>::max(), '\n');
                    cout << "You can only enter floating numbers, please enter the matrix again\n";
                    counter = 0;
                    break;
                }
                else
                {
                    counter++;
                }
            }
        } while (counter < 4);
        // Ignore any additional numbers that the user might input by mistake
        cin.ignore(numeric_limits<streamsize>::max(), '\n');
    }
```

This method awaits the input from the user, once an input is not valid e.g. entering a string, (this is being checked here `if(!(cin >> q[i]))`), the console is cleared then all previous input is cleared so that the user had to enter the matrix again.

To ignore all mistakes I am using `numeric_limits<streamsize>::max(), '\n'` from the `limits` library, this ensures that all errors are indeed ignored no matter the number.

#### Inheritance

The previous code is that of the `Matrix2by2` class, however, it can be slightly altered to create the `Matrix3by3` class, the clear way forward is inheriting the `Matrix2by2` class and overloading all methods and operators.

```c++
    class Matrix3by3:public Matrix2by2
    {
        public:
            Matrix3by3();
            ~Matrix3by3();
            Matrix3by3(float*);
            void setMatrix();
            void getMatrix();
            Matrix3by3 operator+(Matrix3by3);
            Matrix3by3 operator*(Matrix3by3);
            float* invertMatrix();
    };
```

## Final Words

This was a rookie project that provides basic matrix calculation using the C++ language, it was fun to do and it was good practice for all the object-oriented concepts that I learned.

If I were to redo it now, I would probably create a web application having Django as a backend and using Numpy to make all matrix calculations.

There is a great lesson that I learned working on this project and that can be summarized by the following

> "Any code of your own that you haven't looked at for six or more months might as well have been written by someone else." - Eagleson's Law

This was the case when I went back to this code, I wasn't happy with what I saw and I immediately started fixing stuff. Lesson learned well!