---
title: "DSA: Prefix and Difference arrays"
description: Learning about prefix, suffix and difference arrays.
author: quantinium
date: '2026-08-17'
categories:
  - data-structures-and-algorithms
  - prefix arrays
published: true
---

## Prefix Sums
A prefix sum arrays precomputes running totals so that the sum of any subarray can be answered in `O(1)` instead of `O(n)`.
Given `arr[0..n-1]`, we build a prefix arrays `prefix[i] = arr[0] + arr[1] + ... + arr[i]`

```cpp
vector<int> buildPrefix(vector<int>& arr) {
  int n = arr.size();
  vector<int> prefix(n);
  prefix[0] = arr[0];
  for(int i = 1; i < n; i++) {
    prefix[i] = prefix[i - 1] + arr[i];
  }
  return prefix;
}
```

The sum of any range `[l, r]` is then `prefix[r] - prefix[l - 1]` (or just `prefix[r]` when `l == 0`). Padding the array with a leading zero, so `prefix[i]` holds the sum of the first `i` elements, avoids that edge case.

## Suffix Sums
A suffix sum is the mirror image: `suffix[i] = arr[i] + arr[i + 1] + ... + arr[n - 1]`, built by walking from the back.

```cpp
vector<int> buildSuffix(vector<int>& arr) {
  int n = arr.size();
  vector<int> suffix(n);
  suffix[n - 1] = arr[n - 1];
  for (int i = n - 2; i >= 0; i--) {
    suffix[i] = suffix[i + 1] + arr[i];
  }
  return suffix;
}
```

## 2D Prefix Sum
The same idea extends to matrices. We build a padded `(n+1) x (m+1)` prefix matrix so `prefix[i][j]` holds the sum of the rectangle from `(0,0)` to `(i-1,j-1)`, using inclusion-exclusion to avoid double counting the overlapping region.

```cpp
vector<vector<int>> build2DPrefix(vector<vector<int>>& matrix) {
  int n = matrix.size(), m = matrix[0].size();
  vector<vector<int>> prefix(n + 1, vector<int>(m + 1, 0));
  for (int i = 0; i < n; i++) {
    for (int j = 0; j < m; j++) {
      prefix[i + 1][j + 1] = matrix[i][j] + prefix[i][j + 1] + prefix[i + 1][j] - prefix[i][j];
    }
  }
  return prefix;
}
```

The sum of a rectangle from `(r1, c1)` to `(r2, c2)` is `prefix[r2+1][c2+1] - prefix[r1][c2+1] - prefix[r2+1][c1] + prefix[r1][c1]`.

## Difference Arrays
A difference array is the inverse of a prefix sum: `diff[i] = arr[i] - arr[i - 1]` (with `diff[0] = arr[0]`). Its point is range **updates**, not range queries — adding `val` to every element in `arr[l..r]` only requires two `O(1)` writes to the diff array: `diff[l] += val` and `diff[r + 1] -= val`. Reconstructing `arr` afterwards is just a prefix sum over `diff`, so `Q` updates followed by one reconstruction costs `O(Q + n)` instead of `O(Q * n)`.

```cpp
void rangeUpdate(vector<int>& diff, int l, int r, int val) {
  diff[l] += val;
  if (r + 1 < (int)diff.size()) diff[r + 1] -= val;
}

vector<int> reconstruct(vector<int>& diff, int n) {
  vector<int> arr(n);
  arr[0] = diff[0];
  for (int i = 1; i < n; i++) arr[i] = arr[i - 1] + diff[i];
  return arr;
}
```

## Practice questions

- [1480. Running Sum of 1d Array (Easy)](https://leetcode.com/problems/running-sum-of-1d-array/description/)
- [303. Range Sum Query - Immutable (Easy)](https://leetcode.com/problems/range-sum-query-immutable/description/)
- [724. Find Pivot Index (Easy)](https://leetcode.com/problems/find-pivot-index/description/)
- [1991. Find the Middle Index in Array (Easy)](https://leetcode.com/problems/find-the-middle-index-in-array/description/)
- [1732. Find the Highest Altitude (Easy)](https://leetcode.com/problems/find-the-highest-altitude/description/)
- [1854. Maximum Population Year (Easy)](https://leetcode.com/problems/maximize-population-year/description/)

- [2270. Number of Ways to Split Array (Medium)](https://leetcode.com/problems/number-of-ways-to-split-array/description/)
- [523. Continuous Subarray Sum (Medium)](https://leetcode.com/problems/continuous-subarray-sum/description/)
- [560. Subarray Sum Equals K (Medium)](https://leetcode.com/problems/subarray-sum-equals-k/description/)
- [1310. XOR Queries of a Subarray (Medium)](https://leetcode.com/problems/xor-queries-of-a-subarray/description/)
- [304. Range Sum Query 2D - Immutable (Medium)](https://leetcode.com/problems/range-sum-query-2d-immutable/description/)
- [1314. Matrix Block Sum (Medium)](https://leetcode.com/problems/matrix-block-sum/description/)
- [1292. Maximum Side Length of a Square with Sum Less than or Equal to Threshold (Medium)](https://leetcode.com/problems/maximum-side-length-of-a-square-with-sum-less-than-or-equal-to-threshold/description/)
- [370. Range Addition (Medium)](https://leetcode.com/problems/range-addition/description/)
- [1109. Corporate Flight Bookings (Medium)](https://leetcode.com/problems/corporate-flight-bookings/description/)
- [1094. Car Pooling (Medium)](https://leetcode.com/problems/car-pooling/description/)
- [2536. Increment Submatrix by One (Medium)](https://leetcode.com/problems/increment-submatrix-by-one/description/)

- [995. Minimum Number of K Consecutive Bit Flips (Hard)](https://leetcode.com/problems/minimum-number-of-k-consecutive-bit-flips/description/)
