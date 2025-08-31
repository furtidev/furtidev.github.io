+++
title = "Please, let my laptop sleep"
date = 2025-08-31
description = "Why suspend was inconsistent in my Linux system and how I fixed it"
[taxonomies]
tags = ["linux"]
+++

`suspend/sleep` on Linux has been a hit or miss for me. Sometimes it'd work fine, other times it won't. By "won't" I mean a very specific sequence: 

* Power is cut off from the keyboard, mouse and screen
* I can tell my laptop is still on, since the indicator light is still lit
* Either I wait for the battery to drain or I hard-poweroff the laptop

Guess what I used to do? I'm surprised no components are damaged yet. But perhaps that's because components that could be damaged were already not receiving power. It's messy. But why is it happening? Had no clue for a long time. I sought answers from many, yet found none. But I recall one of them told me some systems have trouble with this. This was actually a good hint, but although useless to then-me. The ArchWiki entry on power management also had a good hint:
> **Suspend to RAM (aka suspend)** <br>
The S3 sleeping state as {{highlight(text="defined by ACPI")}}, ...

So it's some sort of discrepancy between the ACPI tables in my firmware and the Linux kernel. If only I had investigated that earlier, I could have spared myself from a ton of pain.

On some laptops, the [DSDT](https://wiki.archlinux.org/title/DSDT) table is tuned specifically for Windows in mind, and so it's difficult for the Linux kernel to interface with it properly. Most functionalities *seemed* to work, but sleep and shutdown consistently gave me trouble. 

Apparently you can re-build the firmware DSDT table, but doesn't seem fool-proof and rather unnecessary in my case. Instead, I ended up adding a few kernel parameters to my GRUB config to camouflage the Linux kernel as Windows when interfacing with ACPI: 

> /etc/default/grub
```sh,linenos
# GRUB boot loader configuration

GRUB_DEFAULT='0'
GRUB_TIMEOUT='5'
GRUB_DISTRIBUTOR='EndeavourOS'
GRUB_CMDLINE_LINUX_DEFAULT='nowatchdog nvme_load=YES loglevel=3 acpi_osi=! acpi_osi="Windows 2020"' # only use Windows 2020 as the interface
GRUB_CMDLINE_LINUX=""
...
```

The kernel parameters and their possible values are all documented in the DSDT article I linked above. Ironically, I found this solution using ChatGPT. It's a bit sad. It's all well documented on ArchWiki, and I opted for slop instead. I was actually surprised. 

*Wow, AI fixed a problem nobody else could?1?! It's joever.*

But turns out it's a very common problem, just that the people I asked also never read the ArchWiki article on power management. But ChatGPT? Oh, it scraped the entire internet alright. So what's the takeaway from all this? It's to always READ THE FUCKING MANUAL.

Apparently there are plenty of other reasons why power management could go wrong on Linux, some of them are more complicated than others. I found a good article on ACPI and Linux: [How I discovered that Bill Gates monopolized ACPI in order to break Linux](https://enaix.github.io/2025/06/03/acpi-conspiracy.html). You SHOULD read it. NOW. I'm glad mine was very simple to fix. Finally, I can put my laptop to sleep as I sing it a sweet lullaby on Rust and the borrow checker.