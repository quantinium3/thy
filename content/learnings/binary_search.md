---
title: "DSA: Binary Search"
description:
author: quantinium
date: '2026-08-18'
categories:
  - virtual-machine
  - container
  - isolates
published: true
---

# Binary Search
It is a searching algorithm that finds a target in a sorted algorithm in `O(log n)` time by halving the search space on each iteration. Since the arrays is already sorted, we can compare the middle element to the target and immediately discard the half of search space:
- if `target == mid`, we found the target
- if `target > mid`, the target must be in right side of mid.
- if `target < mid`, the target must be in left side of mid.

Repeat on the remaining half on each iteration until the search space is empty.

```cpp
int binary_search(vector<int> &nums, int target) {
  int low = 0, high = nums.size() - 1;
  while(low <= high) {
    size_t mid = low + (high - low) / 2;
    if(nums[mid] == target) {
      return mid;
    } else if(nums[mid] > target) {
      high = mid - 1;
    } else {
      low = mid + 1;
    }
  }

  return -1; // not found
}
```

```
arr   = [1, 3, 5, 7, 9, 11, 13], target = 9
index =  0  1  2  3  4   5   6

Step 1: low = 0, high = 6, mid = 3 -> nums[3] = 7
        7 < 9, so low = mid + 1 = 4

Step 2: low = 4, high = 6, mid = 5 -> nums[5] = 11
        11 > 9, so high = mid - 1 = 4

Step 3: low = 4, high = 4, mid = 4 -> nums[4] = 9
        9 == 9, found target at index 4
```

## Complexity
- Time Complexity
  - Best: 1
  - Average: O(log n)
  - Worst: O(log n)

- Space Complexity
  - Best: O(1)
  - Average: O(1)
  - Worst: O(1)

# Binary Search on Answer
Instead of searching for a value inside an array, we binary search over a range of possible answers `[low, high]` using a monotonic `feasible(x)` predicate (false...false, true...true) to decide which half to discard:
- if `feasible(mid)` is true, mid works, try a smaller/larger answer on the matching half.
- if `feasible(mid)` is false, mid doesn't work, discard that half and move to the other side.

Repeat on the remaining half until `low == high`, which is the boundary answer.

```cpp
bool feasible(vector<int> &piles, int h, int k) {
  long hours = 0;
  for(int p : piles) {
    hours += (p + k - 1) / k; // ceil(p / k)
  }
  return hours <= h;
}

int minEatingSpeed(vector<int> &piles, int h) {
  int low = 1, high = *max_element(piles.begin(), piles.end());
  while(low < high) {
    int mid = low + (high - low) / 2;
    if(feasible(piles, h, mid)) {
      high = mid;
    } else {
      low = mid + 1;
    }
  }

  return low;
}
```

```
piles = [3, 6, 7, 11], h = 8

Step 1: low = 1, high = 11, mid = 6 -> hours = 1+1+2+2 = 6
        6 <= 8, feasible, high = 6

Step 2: low = 1, high = 6, mid = 3 -> hours = 1+2+3+4 = 10
        10 > 8, not feasible, low = 4

Step 3: low = 4, high = 6, mid = 5 -> hours = 1+2+2+3 = 8
        8 <= 8, feasible, high = 5

Step 4: low = 4, high = 5, mid = 4 -> hours = 1+2+2+3 = 8
        8 <= 8, feasible, high = 4

low == high == 4, answer = 4
```

## Complexity
- Time Complexity
  - Best: O(n)
  - Average: O(n log(max(piles)))
  - Worst: O(n log(max(piles)))

- Space Complexity
  - Best: O(1)
  - Average: O(1)
  - Worst: O(1)

# Leetcode Practice

## Classic Binary Search
- [704. Binary Search (Easy)](https://leetcode.com/problems/binary-search/description/)
- [35. Search Insert Position (Easy)](https://leetcode.com/problems/search-insert-position/description/)
- [34. Find First and Last Position of Element in Sorted Array (Medium)](https://leetcode.com/problems/find-first-and-last-position-of-element-in-sorted-array/description/)
- [33. Search in Rotated Sorted Array (Medium)](https://leetcode.com/problems/search-in-rotated-sorted-array/description/)
- [81. Search in Rotated Sorted Array II (Medium)](https://leetcode.com/problems/search-in-rotated-sorted-array-ii/description/)
- [153. Find Minimum in Rotated Sorted Array (Medium)](https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/description/)
- [162. Find Peak Element (Medium)](https://leetcode.com/problems/find-peak-element/description/)
- [74. Search a 2D Matrix (Medium)](https://leetcode.com/problems/search-a-2d-matrix/description/)
- [240. Search a 2D Matrix II (Medium)](https://leetcode.com/problems/search-a-2d-matrix-ii/description/)
- [4. Median of Two Sorted Arrays (Hard)](https://leetcode.com/problems/median-of-two-sorted-arrays/description/)

## Binary Search on Answer
- [875. Koko Eating Bananas (Medium)](https://leetcode.com/problems/koko-eating-bananas/description/) — minimize the eating speed
- [1011. Capacity To Ship Packages Within D Days (Medium)](https://leetcode.com/problems/capacity-to-ship-packages-within-d-days/description/) — minimize max load per day
- [410. Split Array Largest Sum (Hard)](https://leetcode.com/problems/split-array-largest-sum/description/) — same shape as 1011, minimize the largest subarray sum
- [1482. Minimum Number of Days to Make m Bouquets (Medium)](https://leetcode.com/problems/minimum-number-of-days-to-make-m-bouquets/description/) — minimize the waiting day threshold
- [1283. Find the Smallest Divisor Given a Threshold (Medium)](https://leetcode.com/problems/find-the-smallest-divisor-given-a-threshold/description/) — nearly identical shape to Koko
- [1552. Magnetic Force Between Two Balls (Medium)](https://leetcode.com/problems/magnetic-force-between-two-balls/description/) — maximize the minimum distance ("Aggressive Cows" pattern)
- [1231. Divide Chocolate (Hard)](https://leetcode.com/problems/divide-chocolate/description/) — maximize the minimum sweetness, mirror of Split Array Largest Sum
- [878. Nth Magical Number (Hard)](https://leetcode.com/problems/nth-magical-number/description/) — feasibility check uses inclusion-exclusion instead of a greedy simulation
- [668. Kth Smallest Number in Multiplication Table (Hard)](https://leetcode.com/problems/kth-smallest-number-in-multiplication-table/description/) — feasibility check counts values `<= x` in the table
- [719. Find K-th Smallest Pair Distance (Hard)](https://leetcode.com/problems/find-k-th-smallest-pair-distance/description/) — binary search on the distance value, count pairs with two pointers
