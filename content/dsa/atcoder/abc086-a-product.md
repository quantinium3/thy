---
title: 'Product'
description: Parity of a product from the parity of its factors, no multiplication needed.
author: quantinium
date: '2026-09-02'
problemUrl: https://atcoder.jp/contests/abc086/tasks/abc086_a
difficulty: '100'
categories:
  - math
  - parity
published: true
---

## Problem

Given two positive integers `a` and `b`, print `Even` if `a * b` is even and `Odd` otherwise.

## Approach

A product is odd only when every factor is odd, so the multiplication is unnecessary — `a * b`
is even iff `a` or `b` is even. Skipping the product also sidesteps overflow on the variants of
this problem with larger bounds.

## Complexity

- time: `O(1)`
- space: `O(1)`

## Code

```cpp
#include <bits/stdc++.h>
using namespace std;

int main() {
    long long a, b;
    cin >> a >> b;
    cout << ((a % 2 == 1 && b % 2 == 1) ? "Odd" : "Even") << '\n';
}
```

## Notes

Same idea generalises: the product of a list is odd iff no element is even, which is one pass
with an early exit.
