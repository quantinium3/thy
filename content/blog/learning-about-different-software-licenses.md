---
title: Learning about different software licenses
description: This is an overview about different software licenses that one can choose on various platforms that define how their software must be used by some other party.
author: quantinium
date: '2026-11-11'
categories:
  - license
published: true
cover_image:
---

There are different types of software licenses you can choose from when publishing software to the public. Their main purpose is to define what third parties are and aren't allowed to do with your published software. With the surge of AI in programming, the meaning of software licenses and attribution has started to fade somewhat, since models are trained on large amounts of code without regard to the licenses it was published under. Still, I think it's worth understanding this when publishing your own software as choosing a license is how you signal to others how you want your software distributed and used, rather than just defaulting to MIT because it's popular and the default on many platforms, and then getting upset when people fork your repo and do things you didn't intend.

## MIT License
This is considered the default license if you dont have any license in your repository on github.
```
MIT License

Copyright (c) [year] [fullname]

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

This is one of the simplest and most permissive licenses. It allows you to use, copy, modify, merge, publish, distribute, sublicense, and/or sell the software, with the only real condition being that the original copyright notice and license text must be included in any copies or substantial portions of the software. So if you pull MIT-licensed code into a repo under a different license, you just need to retain that original notice/attribution. It also explicitly disclaims warranty as the software is provided "as is," and the original author isn't liable for any damages arising from its use.
