---
title: "DSA: Sliding Window"
description: Learning about sliding window technique and leetcode questions.
author: quantinium
date: '2026-08-16'
categories:
  - data-structures-and-algorithms
  - sliding-window
published: true
---

## Sliding Window
It is a technique for solving problems where we need to examine a contiguous subranges (subarrays, substrings). Instead of recomputing result for each subrange from scratch, we maintain a window and then slide it accross data, modifying windows state on `O(1)` operations thus decreasing time complexity.

### Fixed Window
The window size is constant `k` and we move the window one step over a time over the data. For example: [643. Maximum Average Subarray I](https://leetcode.com/problems/maximum-average-subarray-i/description/). If we try to solve it using bruteforce by calculating the avg of each window as traverse the array, we would get `O(n^2)` time complexity as shown below.
```cpp
double findMaxAverage(vector<int>& nums, int k) {
  int n = nums.size();
  int maxSum = INT_MIN;

  for (int i = 0; i + k <= n; i++) {
    int sum = 0;
    for (int j = i; j < i + k; j++) {
      sum += nums[j];
    }
    maxSum = max(maxSum, sum);
  }

  return (double)maxSum / k;
}
```

Solving it using the sliding window aproach where we create a window of k element and as we move forward we just do two `O(1)` operation i.e. adding the new element and subtracting the left element and then compare the max, we can reduce the time complexity to `O(n)` as shown below.
```cpp
double findMaxAverage(vector<int>& nums, int k) {
  int sum = std::accumulate(nums.begin(), nums.begin() + k, 0);
  size_t n = nums.size();
  int maxi = sum;
  for(size_t i = k; i < n; i++) {
      sum += nums[i];
      sum -= nums[i - k];
      maxi = max(sum, maxi);
  }
  return (double)maxi / k;
}
```

### Dynamic window
We have explicity two pointers that mark the start and end of the window and can:
- expand by moving right, adding elements, until the window violates or satisfies a condition
- shrink by moving left forward, removing elements to restore the condition.

For example: [3. Longest Substring Without Repeating Characters](https://leetcode.com/problems/longest-substring-without-repeating-characters/description/). As shown below, we have two pointer `r` and `l` defining the two ends of the window and a `vector<bool>` to mark if the char exists in the current string inside the window.
- We increase window size if that element is not present and increase the maxlength of the substring.
- We shrink the window size if the next element is in the substring.
```cpp
int lengthOfLongestSubstring(string s) {
  vector<bool> a(128, false);
  int ans = 0, l = 0, r = 0;

  while (r < s.size()) {
    if (!a[s[r]]) {
      ans = max(ans, r - l + 1);
      a[s[r++]] = true;
    } else {
      a[s[l++]] = false;
    }
  }
  return ans;
}
```

Another example is [209. Minimum Size Subarray Sum](https://leetcode.com/problems/minimum-size-subarray-sum/description/). As shown below, we do two operation agains
- Increment the sum with the next element.
- Decrease the size of subrange by incrementing `l` until we violate the condition of sum being greater than or equal to target.

```cpp
int minSubArrayLen(int target, vector<int>& nums) {
  int len = INT_MAX;
  int sum = 0;
  for (int r = 0, l = 0; r < nums.size(); r++) {
    sum += nums[r];
    while (sum >= target) {
      len = min(len, r - l + 1);
      sum -= nums[l++];
    }
  }
  return len == INT_MAX ? 0 : len;
}

```

## Practice questions
Fixed size window:
- [643. Maximum Average Subarray I (Easy)](https://leetcode.com/problems/maximum-average-subarray-i/description/) — basic fixed window sum
- [1456. Maximum Number of Vowels in a Substring of Given Length (Medium)](https://leetcode.com/problems/maximum-number-of-vowels-in-a-substring-of-given-length/description/)
- [2461. Maximum Sum of Distinct Subarrays With Length K (Medium)](https://leetcode.com/problems/maximum-sum-of-distinct-subarrays-with-length-k/description/)
- [567. Permutation in String (Medium)](https://leetcode.com/problems/permutation-in-string/description/) — fixed window + frequency map matching
- [438. Find All Anagrams in a String (Medium)](https://leetcode.com/problems/find-all-anagrams-in-a-string/description/) — same pattern as 567

Variable size window (expand/shrink):
- [3. Longest Substring Without Repeating Characters (Medium)](https://leetcode.com/problems/longest-substring-without-repeating-characters/description/) — the classic starter
- [209. Minimum Size Subarray Sum (Medium)](https://leetcode.com/problems/minimum-size-subarray-sum/description/) — shrink while sum ≥ target
- [1004. Max Consecutive Ones III (Medium)](https://leetcode.com/problems/max-consecutive-ones-iii/description/) — window with at most K zero-flips
- [424. Longest Repeating Character Replacement (Medium)](https://leetcode.com/problems/longest-repeating-character-replacement/description/) — window valid while `length - maxFreqChar <= k`
- [1493. Longest Subarray of 1's After Deleting One Element (Medium)](https://leetcode.com/problems/longest-subarray-of-1s-after-deleting-one-element/description/)
- [904. Fruit Into Baskets (Medium)](https://leetcode.com/problems/fruit-into-baskets/description/) — "at most 2 distinct types" in disguise
- [340. Longest Substring with At Most K Distinct Characters (Medium, paywalled on some plans)](https://leetcode.com/problems/longest-substring-with-at-most-k-distinct-characters/description/)
- [76. Minimum Window Substring (Hard)](https://leetcode.com/problems/minimum-window-substring/description/) — the canonical hard variable-window problem
- [992. Subarrays with K Different Integers (Hard)](https://leetcode.com/problems/subarrays-with-k-different-integers/description/) — "exactly K" via atMost(K) − atMost(K−1) trick
- [1358. Number of Substrings Containing All Three Characters (Medium)](https://leetcode.com/problems/number-of-substrings-containing-all-three-characters/description/)
- [1658. Minimum Operations to Reduce X to Zero (Medium)](https://leetcode.com/problems/minimum-operations-to-reduce-x-to-zero/description/) — reframe as "find max window with sum = total − x"
