+++
title = "Trying Ghostty: My experience with terminal emulators"
date = 2024-11-10
description = "and why Ghostty matters"
[taxonomies]
tags = ["writing", "programming"]
+++

# Childhood
I first started programming on an Android phone, basically running a PHP 7.x and MySQL 5.x server (I couldn't find the app I was using for that at the time) and using a barebones text editor (it was probably [this one](https://play.google.com/store/apps/details?id=com.rhmsoft.edit.pro)). I didn't need to interact with terminals. That all changed in 2021, when I was using the terminal more frequently. As far as terminal emulation goes, I just used the basic Command Line, yeah, the Windows one - yikes. I can't imagine how I programmed on Windows. 

# Adolescence
But after some time, I found [Alacritty](https://alacritty.org/). It was fast, it made me feel cool. I installed all the hip stuff, like [Starship](https://starship.rs/) prompt. But Alacritty had no support for tabs and I *love* organizing things via tabs. So it was inconvenient and on top of that, after going through [this discourse](https://github.com/alacritty/alacritty/issues/3129) on their GitHub, I guess it's safe to say that Alacritty will never have tabs. From this thread and some googling, I learned about Kovid Goyal's [kitty terminal emulator](https://sw.kovidgoyal.net/kitty/) - but I was disappointed because `kitty` wasn't on Windows. Okay, I guess I'll use a terminal multiplexer.. oh no I can't - neither [zellij](https://zellij.dev/) nor tmux are natively supported on Windows. I think I did try [Wezterm](https://www.google.com/search?client=firefox-b-d&q=wezterm) somewhere along the way, but it didn't stick for long.

# Redemption
On 13th of January, 2023 (yes, I noted down the exact date), I switched to Linux. That means I could finally use `kitty`. But I had a thought.. what if I just use Alacritty with `zellij`? I did that for a bit and couldn't get used to using a terminal multiplexer for tabs, so - `kitty` it is. So all in all, I've used `kitty` for quite some time up until a **ghost** started haunting me. Before moving on to talking about that, `kitty` deserves some words. I like it a lot - with the occassional [SSH ragequit](https://sw.kovidgoyal.net/kitty/faq/#i-get-errors-about-the-terminal-being-unknown-or-opening-the-terminal-failing-or-functional-keys-like-arrow-keys-don-t-work), you could say it was a love-hate relationship, majority of it being love though. But anyway, I'm supposed to talk about .. the hauntings of a ghost.

# Enter Ghostty
[Mitchell Hashimoto](https://mitchellh.com/). You might know him. He's just this niche guy, ***co-founder of [HashiCorp](https://www.hashicorp.com/)***. So, when he announced that he was working on a terminal emulator written fully in Zig - there was hype. This was the light in the darkness, as Warp (no, I don't feel like linking Warp) receives $73M in funding for their terminal emulator where you have to log in, yes, log in to use your terminal, the coming of Ghostty showed light to the believers.

Ghostty is still in private beta, with a [1.0 release](https://mitchellh.com/writing/ghostty-is-coming) coming in December, 2024. Mark your calendars, folks. I got invited into the private beta right before Halloween, so it fits. 

### Purpose
But why does Ghostty exist? There are a few key reasons:
- **Native UI**. It uses GTK on Linux and SwiftUI on MacOS. This also means native tabs support. While `kitty` does support tabs, it doesn't use native widgets.

- **Extremely fast**, often beating Alacritty.

- **Feature-rich**. Supports kitty image protocol, native support for emojis, built-in terminal inspector for rich terminal debugging etc.

- **Most importantly**, all of this in a *complete* cross-platform package. Before Ghostty, there wasn't a single terminal emulator that had all of the aforementioned perks. See figure 1 & 2 below for a summary.


{{image_with_figure(path="./figure-1.webp", w_scale="70%", h_scale="70%", figure="Figure 1: Chart comparing popular terminal emulators with Ghostty")}}

{{image_with_figure(path="./figure-2.webp", w_scale="70%", h_scale="70%", figure="Figure 2: Core purpose of Ghostty.")}}

{{image_with_figure(path="./tabs_one.png", w_scale="70%", h_scale="70%", figure="Native tabs, using GTK on Linux")}}

{{image_with_figure(path="./kitty_image_protocol.png", w_scale="70%", h_scale="70%", figure="Image rendering using Kitty Image Protocol (image: NCR Veteran Ranger Helmet)")}}

{{image_with_figure(path="./terminal_inspector.png", w_scale="70%", h_scale="70%", figure="Built-in terminal inspector for TUI debugging")}}

What more could one ask for?! Well, as it turns out.. a lot more. Ghostty wants to be the browser-equivalent for TUIs (terminal user interface). It wants to have native support for progress bars, context menus, drag & drop, mouse gestures and so much more - a complete platform for text based user interfaces. I mean, that's A LOT to take in, even though these are long-term goals. It's ambitious, it's exciting, and finally there's someone willing to bring innovations to the terminal.

At the core of Ghostty, there's `libghostty`, a cross-platform library that powers Ghostty. I like where they're going with this, essentially you can use libghostty to ship whatever you want: standalone TUI applications, embedding Ghostty in other places and even getting a terminal emulator running on the web, seems like your imagination is the limit. Ghostty itself is a software using libghostty. Sort of like how the Godot game engine is a Godot "game". `libghostty` will eventually be available as a standlone library, and I'm excited for that - it exposes a C api so you can use whatever language you want with it as long as it can interface with C.

Even though it currently only supports MacOS and Linux, Windows support is planned for sometime after the 1.0 release. I'll shed a tear when that happens, considering the pain I had to go through to find an appropriate terminal emulator for my needs on Windows.

So even though I was a bit confused by why Ghostty needs to exist at first, I'm now completely sold. And to be completely honest, *you* should be too.

### Daily driving
Ever since I got access to the private beta, Ghostty has been my daily driver. Sorry cat terminal. Apart from some weird issues here and there which I reported, it has been fantastic. The community is friendly, there's an active group of developers writing TUIs on Ghostty and some are contributing to the project itself. Point is, Ghostty gets out of the way and lets me do my work peacefully. I also giggle once in a while thinking a ghost is watching me while I run my commands. So if you were wondering if it's ready for some rigorous daily use, now you know.  

I'm not an avid recompiler, in fact I haven't recompiled Ghostty ever since. I should really do it one of these days.  

# Conclusion
Need I say more? I'm sure I've gotten my point across, yes, Ghostty is good. You should use it when it's out. Also, why not [join the Discord](discord.gg/ghostty)? I forgot to mention a *killer* feature: shaders. I wrote a small TUI to make the best use of it (if you can't tell, I've been playing a lot of Fallout: New Vegas):

{{image_with_figure(path="./fallout_terminal.png", w_scale="70%", h_scale="70%", figure="I got spurs that jingle, jangle, jingle")}}

There's also a repository for Ghostty shaders: [hackrmomo/ghostty-shaders](https://github.com/hackrmomo/ghostty-shaders). And lastly:
- Childhood: Clueless early days of programming.
- Adolescence: Still clueless, but pretending to be wise using Windows for development. 
- Redemption: Making up for my past crimes and switching to Linux.

Also, I can't wait to actually contribute to Ghostty someday, but that's for another time. For now, I gotta take a nap. This blog took *[calculates time]* at least 3 hours. Goodbye, Good Night, Oyasumi and everything else. 