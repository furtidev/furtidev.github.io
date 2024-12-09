+++
title = "My experience with password managers"
date = 2023-09-11
description = "Sharing my experiences with 3 different password managers and hating on LastPass"
[taxonomies]
tags = ["review"]
+++
Back when I was a foolish young man, I used the same password everywhere so that I won't have to struggle with remembering what password I set for what account. In retrospect, that was a very, very stupid decision. And as you can guess, I got [pwned](https://haveibeenpwned.com/)!

So after that I finally decided to use a password manager. So I'll be sharing my experience with the ones I've used so far.

## LastPass (don't)
I chose LastPass at first because Daddy Google had it on top of the search results when I looked up 'Best Password Manager'. I was using it until LastPass had a data breach last year, it was a huge mess. A few months later the company revealed that GoTo's (the company behind LastPass) other services were also attacked, plus encrypted backups **with encryption keys for said backups** and MFA data were also stolen. 

GoTo didn't give any more details about it, like how old the backups were etc. LastPass is a horrible service. GoTo is a horrible company, the handled the breach very poorly. Constantly getting spammed with promotional e-mails was also very annoying. I just exported all my data, changed all my passwords and switched to BitWarden.

## BitWarden (great)
I just said to myself, "Heh, it can't be worse than LastPass", and went in. First of all, BitWarden is open source on [GitHub](https://github.com/bitwarden/). I used the free plan but the personal premium plan is also great, only $10/year. Unlike LastPass, BitWarden actually encrypts all your fields. I had a very strong and long (that's... what... she.... said....) master password. 

Regular security audits conducted by notable third-party security firms, open source, self-hostable, generous free plan, transparent company, [zero knowledge encryption](https://bitwarden.com/help/what-encryption-is-used/) ([white paper](https://bitwarden.com/resources/zero-knowledge-encryption-white-paper/)), good reputation and I like their philosophy towards security. 

BitWarden one day randomly locked me out of my account with the following error: "Traffic from your network looks unusual" - why? I don't know! But either way, it was enough of a reason to not use BitWarden anymore.

## KeePassXC (currently using, great)
I currently use KeePassXC. There's no server involved, you just download KeePassXC and start using it. Importing data from BitWarden wasn't hard though it wasn't seamless either. I just save regular backups of my database on the cloud, and use a strong master password. Plus, you can also use YubiKey and OnlyKey for extra protection. It is also open source software and I like that everything about it is handled by me and me only. I also use it for OTP.

I'm no encryption/security specialist, I just wanted to share my experience so if I've made any mistakes then comment below or send me an email on: [furtidev@poto.cafe](mailto:furtidev@poto.cafe).
