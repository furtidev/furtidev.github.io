+++
title = "Setting up Wine + Bottles on an external drive"
date = 2025-05-25
description = "Cursed Linux gaming setup"
[taxonomies]
tags = ["tutorial"]
+++
## ToC
- [Step 1: Setup Flatpak](#step-1-setup-flatpak)
- [Step 2: Setup Bottles](#step-2-setup-bottles)
- [Step 3: Running games](#step-3-running-games)

So here's the deal:
- I'm dual booting with Windows 10.
- My Linux partition doesn't have as much storage, because at the time, I thought I wouldn't want to play games while on the Linux boot and nothing else takes much space. Movies? Manga? Anime? I can store them on one of the Windows partitions easily (thanks to whoever wrote NTFS drivers for Linux).
- I don't want to boot into Windows 10 everytime I want to play a game.

It's simple enough to run native Linux games while storing them on an NTFS partition. But, what if I want to play games that don't have Linux builds (or have broken Linux builds)? I'll need Wine. I'm familiar with [Bottles](https://usebottles.com), a very easy to use Wine prefix manager.

It's a bit involved to set up Bottles in this scenario to use Windows partitions (could be external drives, but I only have one drive split into partitions, takes the same process) for storage instead of filling up my already tiny Linux one. But it isn't that hard and I want to document it.

### Step 1: Setup Flatpak
You need Flatpak if you want to use Bottles since it's mainly distributed through Flathub. I know, it's a bit annoying and flatpaks are space hungry (because of which this whole blog exists) but it is what it is.

[Install Flatpak](https://flatpak.org/setup/) through your distro's intended way, and setup Flathub on it. Don't install anything with it yet.

We want to change some configuration. Mount your desired drive where you want to store all this. For me, it's a Windows partition mounted at `/run/media/furtidev/Games`. This drive always needs to be mounted before you run Bottles after we're done.

First things first, create the configuration directory if it doesn't exist already:
```bash
# -p doesn't error out if a directory already exist.
$ sudo mkdir -p /etc/flatpak/installations.d
```

Next up, let's edit a file there:
```bash
$ sudoedit /etc/flatpak/installations.d/gaming.conf # could be named anything
```
Append this:
>/etc/flatpak/installations.d/gaming.conf
```conf
[Installation "gaming"]
Path=/run/media/path/to/your/drive/flatpak # for me: /run/media/furtidev/Games/Linux/Flatpak
DisplayName=Flatpak installation for gaming needs
StorageType=harddisk # mmc, sdcard, harddisk, network
```

You need to ensure that `Path` already exists. Save and you're done.

### Step 2: Setup Bottles
```bash
$ flatpak --installation=gaming install flathub com.usebottles.bottles
```
This will take a while depending on your internet speed.

Here's the thing: while Bottles itself is installed on the other drive/partition that you specified in `/etc/flatpak/installations.d/gaming.conf`, it's data is still residing on your current Linux partition. We don't want that. But first, run Bottles for the first time.

```bash
$ flatpak --installation=gaming run com.usebottles.bottles
```

The `--installation` flag is optional if this is the only Bottles you have. Let it do it's thing and exit once you're on the main screen.

We're going to use symlinks to trick Bottles into storing data elsewhere.

Bottles stores it's files at `~/.var/app/com.usebottles.bottles` (you can check right now if there's anything there). We're interested in the `~/.var/app/com.usebottles.bottles/data` folder.

```bash
$ mv ~/.var/app/com.usebottles.bottles/data /run/media/path/to/your/drive/flatpak/bottles_data
```

Of course, the exact path depends on you, it doesn't have to be `flatpak/bottles_data`. Let's give Bottles permissions to access our new location.

```bash
$ sudo flatpak override --installation=gaming --filesystem=/run/media/path/to/your/drive/flatpak/bottles_data com.usebottles.bottles
```

You might not need `sudo`. Anyway, now's the imporant part: we need to symlink `/run/media/path/to/your/drive/flatpak/bottles_data` to `~/.var/app/com.usebottles.bottles/data`.

```bash
$ ln -s /run/media/path/to/your/drive/flatpak/bottles_data ~/.var/app/com.usebottles.bottles/data
```

And you're done. Run Bottles to see if everything's working fine.

### Step 3: Running games
I've noticed that I can't access my game files if I don't give Bottles permission to read those directories. So I'm going to show a few examples of how you might go about this:

```bash
$ sudo flatpak override --installation=gaming \
	 --filesystem=/run/media/path/to/your/drive/Games com.usebottles.bottles

# OR

$ sudo flatpak override --installation=gaming \
	 --filesystem=/run/media/path/to/your/drive/Games/TES4Oblivion com.usebottles.bottles
```

I haven't tried setting up Steam because I don't own anything that doesn't have a native Linux build.

### It was worth it
In the end, my Flatpak installation ended up being 6.4G and Bottles data ended up being 3.2G big. And that's without any games. I couldn't "waste" this much storage on my Linux partition. This was worth it.