---
title: 'Good Kid'
description: Adding one to the smallest digit maximises the product — a small exchange argument.
author: quantinium
date: '2026-09-03'
problemUrl: https://codeforces.com/problemset/problem/1873/B
difficulty: '800'
categories:
  - greedy
  - math
published: true
---

## Problem

You are given `n` digits. You may add `1` to exactly one of them. Maximise the product of all
the digits.

## Approach

Let the product of everything except the digit you touch be `P`, and the chosen digit be `d`.
Picking `d` turns the answer into `P * (d + 1)`, i.e. the full product scaled by `(d + 1) / d`.
That ratio shrinks as `d` grows, so the smallest digit is always the right choice.

The edge case is free rather than special: if some digit is `0`, the product is `0` unless you
bump that zero, and `0` is also the minimum — the same rule picks it.

Constraints are tiny (`n <= 9`, digits `0..9`), so just find the minimum and multiply.

## Complexity

- time: `O(n)` per test case
- space: `O(1)`

## Code

```cpp
#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int t;
    cin >> t;
    while (t--) {
        int n;
        cin >> n;
        vector<int> a(n);
        for (int &x : a) cin >> x;

        int idx = min_element(a.begin(), a.end()) - a.begin();
        a[idx] += 1;

        long long prod = 1;
        for (int x : a) prod *= x;
        cout << prod << '\n';
    }
}
```

## Notes

The exchange argument — "compare the two candidate choices as a ratio, keep the better one" — is
the standard way to justify a greedy pick on these Div. 4 B problems.
