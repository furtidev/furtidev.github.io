+++
title = "What's so hard about writing a JSON parser?"
date = 2025-01-19
description = "turns out, not much"
[taxonomies]
tags = ["programming"]
+++

I always assumed JSON was a complex format to implement, but it's quite simple. So simple that you don't even need to read RFC 8259 - there's a simple, straight to the point webpage denoting JSON in it's entirety in just a few lines and some pretty pictures (yay!). If you've never done this before, and want to write a parser for JSON yourself then go to the [JSON spec](https://www.json.org/json-en.html) website and have fun. You'll need to learn about some basic concepts as well, such as tokenization, parsing and abstract syntax trees.

I'll do a overview: Tokenization or lexing, is the process of giving meaning to characters (e.g in Python, the characters `f`, `o` & `r` don't mean anything on their own, but together they form the `for` keyword, this is the job of the lexer). After you're done lexing, you're left with a bunch of tokens for keywords, number and string literals etc. The tokens themselves can contain additional data, such as the line & column in the original source code from where they came from. More importantly, some tokens do need to hold on to the original value. For example, a `NUMBER` token should contain the integer value the token was generated from, otherwise that data will be lost. These still don't mean anything. Parsing is the process of giving meaning to a stream of tokens by using a data structure to represent the original structure and thus meaning, of the source code. Trees are commonly used to represent source code because they naturally map to the hierarchy of code, referred to as the abstract syntax tree (AST) or parse tree. You may find Wikipedia's entry on ASTs helpful but of course, there are plenty of content on the internet about this.

Now, if you don't want any more hints, then you should stop reading this blog right here and come back later when you're done with your parser and if you want, compare with my approach.

Keep in mind that I'll use `...` to indicate lines of code not shown in the snippets. Also this isn't a tutorial on how to write a JSON parser as I'll only be talking about what kind of decisions I made on certain aspects. I was learning some Rust a while ago and wanted to test what I had learned so far, so I decided to write my parser in Rust. Tokenization was fairly easy but there are some catches. Numbers in JSON map to JavaScript numbers, so one key feature is scientific notation: `10e-5` evaluates to `0.0001`. Rust also supports this, so parsing numbers was really just as simple as capturing the string and casting it to a float.

>tokenizer.rs
```rust,linenos
let num_result: Result<f64, _> = iter::once(ch)
    .chain(from_fn(|| {
        self.input.by_ref().next_if(|s| {
            s.is_ascii_digit()
                || *s == 'e'
                || *s == 'E'
                || *s == '-'
                || *s == '+'
                || *s == '.'
        })
    }))
    .collect::<String>()
    .parse();
```

String literals took a bit more effort, my tokenizer was getting confused between string literals and `true`/`false`/`null` values. In JSON, string literals can only begin with double quotes, so I came up with a simple trick, the tokenizer switches to "string parsing mode" when it detects a double quote.

>tokenizer.rs
```rust,linenos
match ch {
    ...
    '"' => {
        self.string_mode = !self.string_mode;
        tokens.push(Token::Quote);
    }
    ...
}
```

So, now in the next iteration, the tokenizer checks if `string_mode` is `true` and checks to make sure the current token is not a double quote (because that would mean the string literal has ended). I wrote a helper function called `make_string()` to deal with the parsing. Now, this function is poorly designed or perhaps you could say, it's poorly named. Because it also handles the logic for creating `true`/`false`/`null` tokens. You might wonder why, but it's simply because the logic for parsing string literals and these special tokens were quite similar, and I .. got a bit lazy so I merged them into a single function.

>tokenizer.rs
```rust,linenos
if self.string_mode && ch != '"' {
    let tok = Token::Str(self.make_string(false)); // false means it's not a special token but a literal
    tokens.push(tok);
    self.advance();
    continue;
}
...
match ch {
    ...
    't' | 'f' => {
        let bool_value = self.make_string(true);
        if bool_value == "true" {
            tokens.push(Token::Bool(true))
        } else if bool_value == "false" {
            tokens.push(Token::Bool(false))
        }
    }
}
```

String literals can also use escape sequences (only a handful are supported by the spec) but fortunately implementing them is trivial. Similar to how if the tokenizer detects a double quote it goes into string parsing mode, this time, if the string parser detects a forward slash (`\`) - it goes into escape mode.

>tokenizer.rs
```rust,linenos
let mut ident = String::new();
let mut escape_mode = false;

while let Some(ch) = self.input.peek() {
    ...
    if *ch != '"' && !escape_mode {
        // go to escape mode if `\` was detected.
        if *ch == '\\' {
            escape_mode = true;
            self.advance();
            continue;
        }
        ident.push(*ch);
        self.advance();
    } else if escape_mode {
        // parse JSON standard escape codes
        match *ch {
            '"' => ident.push(*ch),
            '\\' => ident.push('\\'),
            '/' => ident.push('/'),
            'b' => ident.push('\u{0008}'),
            'f' => ident.push('\u{000c}'),
            'n' => ident.push('\u{000a}'),
            'r' => ident.push('\u{000d}'),
            't' => ident.push('\u{0009}'),
            _ => {}
        }
        escape_mode = false;
        self.advance();
    } else {
        // non-escape quote detected, end string.
        break;
    }
    ...
}
```

So with that, the tokenizer is done. If you're wondering, here are all the token variants:

>tokenizer.rs
```rust,linenos
pub enum Token {
    LeftBrace,
    RightBrace,
    LeftBracket,
    RightBracket,
    Quote,
    Comma,
    Colon,
    Str(String),
    Number(f64),
    Bool(bool),
    Null,
    Eof,
}
```

Writing the lexer took me 3 hours, spread across two days. The parser was actually a bit simpler. The hard part was figuring out a coherent structure to represent JSON. Rust is a strictly typed language, I can't plop a `f64` into a `bool`, the compiler will refuse to compile. But the issue is, JSON doesn't have such restrictions, you can put a boolean, a string or a number as values anywhere (except keys, they can only be string literals). Also, JSON files can be as simple as this:

>a_perfectly_valid_json_file.json
```json
true
```

Which means the root of a JSON file can be anything, but commonly it's an array or a key-value structure (called *objects* in the spec). Now the question is: how do we represent this dynamic file format in Rust? You see, enums in Rust can hold values and this feature can be used to achieve the dynamism we need. We just need to define an enum with all possible types of values and just refer to the enum type everywhere else - a job well done. To be fair, this isn't anything revolutionary. I didn't come up with this, it's a common practice in Rust.

>parser.rs
```rust,linenos
pub enum Value {
    Null,
    Str(String),
    Num(f64),
    Bool(bool),
    Obj(Object),
    Arr(Array),
}
```

I could've mapped JSON objects to a `std::collections::HashMap` but in the end I went with my own structs for both objects and arrays, their definitions are simple.

>parser.rs
```rust,linenos
pub struct Root {
    pub child: Option<Value>,
}

// {... properties ...}
pub struct Object {
    pub children: Vec<Property>,
}

// [... any values ...]
pub struct Array {
    pub children: Vec<Value>,
}

// "key": value
pub struct Property {
    pub lhs: String,
    pub rhs: Value,
}
```

As you can see, wherever JSON allows any valid value, we put our newly created enum `Value` as the type. The parser starts by creating a root node and iterating through the tokens. Parsing needs to be recursive when you have things that can contain themselves (e.g an array can contain more arrays), so keeping this in mind, we determine the root value, and if it's an array or an object, we call their respective parsing functions, this easily helps to make the entire process recursive because within those functions we call the parsing functions again if we detect arrays or objects, and so on and so forth. Now, I got a bit lazy again and did a lot of code duplication for each of these functions, and there are nicer ways to do it but I had already crossed the deadline I set for myself so some corners were cut.

>parser.rs
```rust,linenos
fn parse(&mut self) -> Root {
    let mut root: Root = Root { child: None };

    while let Some(tok) = self.curr_tok.clone() {
        match tok {
            ...
            Token::LeftBracket => {
                let array = self.parse_array();
                root.child = Some(Value::Arr(array));
            }
            Token::LeftBrace => {
                let object = self.parse_object();
                root.child = Some(Value::Obj(object));
            }
            ...
        }
        ...
    }

    root
}
```

So those were all the necessary puzzles that needed to be solved, and soon enough I had a functioning parser. I haven't benchmarked it but it's definitely not faster than production grade parsers written in Rust. This is a rather naive implementation. So I've accurately named it: [furtidev/dumb_json_parser](https://github.com/furtidev/dumb_json_parser). Take a look at the GitHub repo if you are interested in all the code. I wrote an example app where I was directly using the "tree" and I noticed a lot of repetition. Perhaps it can be quite nice to use if I add some high-level APIs. Perhaps another time. Recreational projects like these are fun to work on and I have a few lined up, hopefully when they're done I can write about them too. Goodnight.

{{image_with_figure(path="https://github.com/furtidev/dumb_json_parser/raw/main/assets/tweet.png", w_scale="70%", h_scale="70%", figure="@TheGingerBill: If you cannot write a parser for JSON from scratch: you need to learn how to do that NOW!")}}
