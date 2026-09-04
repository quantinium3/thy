---
title: 'Two Sum'
description: Single pass hash map that trades memory for time on the classic pair-sum problem.
author: quantinium
date: '2026-09-04'
problemUrl: https://leetcode.com/problems/two-sum/
difficulty: easy
categories:
  - hashing
  - array
published: true
---

## Problem

Given an array `nums` and an integer `target`, return the indices of the two numbers that add
up to `target`. Exactly one valid answer exists and the same element may not be used twice.

## Approach

The brute force is every pair, `O(n^2)`. The observation that kills the inner loop is that for a
fixed `nums[i]` there is exactly one value that completes it — `target - nums[i]`. So the question
"is the complement somewhere in the array" becomes a lookup instead of a scan.

Walk the array once, and before inserting `nums[i]` check whether its complement was already seen.
Checking before inserting is what stops an element from pairing with itself.

## Complexity

- time: `O(n)` — one pass, average `O(1)` per hash operation
- space: `O(n)` — the map holds at most every element

## Code

```cpp
class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        unordered_map<int, int> seen;
        for (int i = 0; i < (int)nums.size(); ++i) {
            auto it = seen.find(target - nums[i]);
            if (it != seen.end()) return {it->second, i};
            seen[nums[i]] = i;
        }
        return {};
    }
};
```

## Notes

If the array were sorted, two pointers would do the same in `O(1)` extra space — worth remembering
when a variant hands you a sorted input.
