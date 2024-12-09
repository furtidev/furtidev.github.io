+++
title = "Plankton Devlog #1"
date = 2023-10-15
description = "Trying to write my own programming language."
[taxonomies]
tags = ["programming"]
+++
Apparently people make new programming languages all the time, a few of my friends did it too, so why miss out? That's what I thought last year. I even chose a name for my language at the time. But I never actually got around to it until a few days ago. 

<center><img src="https://i.ibb.co/RYdSZPt/image.png" /></center>

# The gameplan
That's great Furti, but how do you make a programming language? Thankfully I had some previous knowledge about the topic, mostly from reading [Writing an interpreter in Go](https://interpreterbook.com/) (I never finished it ☹) and researching about it last year. So my approach was simple:
- Figure out the syntax of the language.
	- I wanted it to have very simple syntax, with static typing. It turned out to be a combination between C and Python. 
- Write the lexer.
	- This was the easiest part so far. The purpose of a lexer is to convert source code into a list of tokens. But it is also the most stable part of my language so far, because everything else is a joke. 
- Write the parser.
	- A parser's job is to take the list of tokens and build out an Abstract Syntax Tree (AST). So basically representing our source code using a tree structure. 
- Write the compiler (or the interpreter because writing a compiler is hard).
	- Well, I want to write a compiler using [QBE](https://c9x.me/compile/) as a backend. It is not an easy task, so I've decided to write an interpreter for now. We'll leave the compiler for Future Furti™. My interpreter just traverses through the AST and does silly things. We'll talk more about this later.

## Syntax of Plankton
I think the best way to showcase the syntax is to show some code in Plankton:
> PLANKTON
```kotlin
n: int = 4832;
print(n);
while (n != 1) {
	if (n % 2 == 0) {
		n = n / 2;
	} else {
		n = 3 * n + 1;
	}
	print(n);
}

fun add(x, y: int) int {
	return x + y;
}

print(add(34, 39));
```

This combination of C and Python is not my greatest idea but hey, it works. The language is statically typed, so all variables must have their types defined. 

## What is AST?
So far this is the part that took the longest. I couldn't figure out how to write an AST generator (a.k.a parser). But a website that helped me out a lot was [AST Explorer](https://astexplorer.net/). In AST Explorer, you can generate AST for popular programming languages. So I got somewhat of an idea of how to make my own parser. I won't bore you with the details but if you're interested, check out [this video](https://www.youtube.com/watch?v=wINY109MG10) on how an AST works.

My parser represents the AST using Python dictionaries, so it was pleasant to work with, though I'm not sure if I'm sacrificing my long term sanity by doing this. Guess we'll find out in later devlogs.

<center><img src="https://ruslanspivak.com/lsbasi-part7/lsbasi_part7_astprecedence_01.png" width="50%" height="50%" /><br><small>Example of an AST (<a href="https://ruslanspivak.com/lsbasi-part7/">from here</a>)</small></center>

## The Interpreter
I have no idea how to make an interpreter. No, seriously, I don't. So what I did was make a simpler iterator that iterates over the AST and performs various actions depending on the data provided by the AST. Variables are stored in a global dictionary. 

Let's say we're trying to run this piece of code:
> PLANKTON
```kotlin
x: int = 2023;
print(x);
```

Interpreter sees that there's a variable declaration, so what does it do? It adds the variable to the dictionary like this: `self.variables[var.identifier] = var.value` which translates to `self.variables["x"] = 2023`.

Now, when it comes to printing the variable, all we do is: `print(self.variables[print_argument]`, so it translates to `print(self.variables["x"])`.

So it is pretty dumb, and I still have no idea how to actually write an interpreter. Wish me luck!

But hey, it works:
<center><img src="https://i.ibb.co/tcjhYwR/image.png" /></center>

## What's next?
My main focus for now is going to be on the AST, since it's still premature and I want to make it full-fledged before moving on to interpreters and compilers. 

If you have any feedback or suggestions regarding my approach, feel free to comment below or send me an email on: [furtidev@poto.cafe](mailto:furtidev@poto.cafe). Until next time!
