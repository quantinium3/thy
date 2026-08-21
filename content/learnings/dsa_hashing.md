---
title: "DSA: Hashing and Hash Map Design"
description: Learning about hash functions, collision resolution, load factor/resizing, and designing a hash map and LRU cache from scratch with leetcode questions for practice.
author: quantinium
date: '2026-08-21'
categories:
  - data-structures-and-algorithms
  - hashing
published: true
---

# Hashing
A hash function maps a key (int, string, object) to an index in a fixed-size array of `capacity` buckets: `index = hash(key) % capacity`. Put/get/delete then become O(1) average, since you jump straight to the bucket instead of scanning. The catch is **collisions** i.e. two different keys can map to the same index so a real hash map needs a strategy for handling them, plus a way to grow when it fills up.

# Collision Resolution

## Chaining
Each bucket holds a list (or small tree, once it grows large enough) of all key-value pairs that hashed to it. On collision, just append to that bucket's list. Lookup scans the list at `hash(key)`.

```
capacity = 4

put(1, "a") -> hash(1)=1 -> bucket[1] = [(1,"a")]
put(5, "b") -> hash(5)=1 -> bucket[1] = [(1,"a"), (5,"b")]   (collision, appended)
put(9, "c") -> hash(9)=1 -> bucket[1] = [(1,"a"), (5,"b"), (9,"c")]
put(2, "d") -> hash(2)=2 -> bucket[2] = [(2,"d")]

get(9) -> hash(9)=1 -> scan bucket[1]: (1,"a") no, (5,"b") no, (9,"c") yes -> "c"
```

Degrades to O(n) per operation only if every key collides into one bucket (adversarial input or a bad hash function). This is why languages like Java convert a bucket's list into a red-black tree once it passes a size threshold, capping worst case at O(log n).

## Open Addressing
Every key lives directly in the array. On collision, probe for the next open slot according to some sequence:
- **Linear probing**: try `index, index+1, index+2, ...` (wraps around). Simple, but collisions cluster together ("primary clustering"), making later probes longer.
- **Quadratic probing**: try `index, index+1^2, index+2^2, ...`. Spreads out clustering.
- **Double hashing**: step size comes from a second hash function, `index + i * hash2(key)`. Best spread, avoids clustering almost entirely.

```
capacity = 4, linear probing

put(1, "a") -> hash(1)=1 -> slot 1 empty -> place at 1
put(5, "b") -> hash(5)=1 -> slot 1 taken -> try slot 2 -> empty -> place at 2
put(9, "c") -> hash(9)=1 -> slot 1 taken -> slot 2 taken -> try slot 3 -> place at 3

table = [_, (1,"a"), (5,"b"), (9,"c")]
```

Deletion is trickier here than with chaining: you can't just null out a slot, since that could break the probe chain for a later key. Deleted slots are usually marked with a `TOMBSTONE` sentinel instead, so probing keeps searching past them.

# Load Factor and Resizing
Load factor `alpha = n / capacity` (n = number of entries) measures how full the table is. As `alpha` grows, chains get longer / probe sequences get longer, and operations drift from O(1) toward O(n). Real implementations rehash i.e. allocate a bigger array (usually double the capacity) and reinsert every existing key. Once `alpha` crosses a threshold (commonly 0.75). Resizing itself is O(n), but since it happens exponentially less often as the table grows, the *amortized* cost per insert stays O(1).

# Designing a Hash Map (Chaining)
```cpp
class MyHashMap {
  vector<list<pair<int, int>>> buckets;
  int capacity;

  int hash(int key) {
    return key % capacity;
  }

public:
  MyHashMap() : capacity(1000), buckets(1000) {}

  void put(int key, int value) {
    int idx = hash(key);
    for(auto &p : buckets[idx]) {
      if(p.first == key) {
        p.second = value;
        return;
      }
    }
    buckets[idx].push_back({key, value});
  }

  int get(int key) {
    int idx = hash(key);
    for(auto &p : buckets[idx]) {
      if(p.first == key) return p.second;
    }
    return -1;
  }

  void remove(int key) {
    int idx = hash(key);
    buckets[idx].remove_if([key](const pair<int, int> &p) {
      return p.first == key;
    });
  }
};
```

## Complexity
- Time Complexity
  - Best: O(1)
  - Average: O(1)
  - Worst: O(n) (all keys collide into one bucket)

- Space Complexity
  - Best: O(n)
  - Average: O(n)
  - Worst: O(n)

# Leetcode Practice

## Hash Map / Hash Set Design
- [706. Design HashMap (Easy)](https://leetcode.com/problems/design-hashmap/description/)
- [705. Design HashSet (Easy)](https://leetcode.com/problems/design-hashset/description/)
- [146. LRU Cache (Medium)](https://leetcode.com/problems/lru-cache/description/)
- [380. Insert Delete GetRandom O(1) (Medium)](https://leetcode.com/problems/insert-delete-getrandom-o1/description/)
- [460. LFU Cache (Hard)](https://leetcode.com/problems/lfu-cache/description/)

## Hashing Applications
- [1. Two Sum (Easy)](https://leetcode.com/problems/two-sum/description/)
- [49. Group Anagrams (Medium)](https://leetcode.com/problems/group-anagrams/description/)
- [128. Longest Consecutive Sequence (Medium)](https://leetcode.com/problems/longest-consecutive-sequence/description/)
- [560. Subarray Sum Equals K (Medium)](https://leetcode.com/problems/subarray-sum-equals-k/description/)
- [187. Repeated DNA Sequences (Medium)](https://leetcode.com/problems/repeated-dna-sequences/description/)
