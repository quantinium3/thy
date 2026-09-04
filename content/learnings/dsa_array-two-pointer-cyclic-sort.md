---
title: "DSA: Arrays, Two Pointers and cyclic sort"
description: Learning about arrays, two pointer approach and cyclic sort pattern with some leetcode questions for practice.
author: quantinium
date: '2026-08-15'
categories:
  - data-structures-and-algorithms
  - arrays
  - two-pointers
  - sort
published: true
---

## Arrays
An array is a linear data structure that stores similar data in a fixed-sequence which is contiguously allocated. This makes it easier to access the element directly using its index. Let's take an example.

```c
#include <stdio.h>
int main() {
  // allocate 8 elements and insert their values
  // [1, 2, 3, 4, 5, 6, 7, 8]
  int arr[8] = {1, 2, 3, 4, 5, 6, 7, 8};
  printf("%d", arr[0]);
}
```

To understand better what is happening lets look at some assembly. As we can see below, we allocated `32 bytes (8 * 4(int))` and by pointer arithmetic `rbp-32` would be index `0` and so on till `rbp-4` which would be the last element
```asm
.LC0:
        .string "%d"
"main":
        push    rbp
        mov     rbp, rsp
        ; allocates 32 bytes
        sub     rsp, 32
        mov     DWORD PTR [rbp-32], 1 ; putting value 1 at index 0
        mov     DWORD PTR [rbp-28], 2 ; putting value 2 at index 1
        mov     DWORD PTR [rbp-24], 3 ; putting value 3 at index 2
        mov     DWORD PTR [rbp-20], 4 ; putting value 4 at index 3
        mov     DWORD PTR [rbp-16], 5 ; putting value 5 at index 4
        mov     DWORD PTR [rbp-12], 6 ; putting value 6 at index 5
        mov     DWORD PTR [rbp-8], 7  ; putting value 7 at index 6
        mov     DWORD PTR [rbp-4], 8  ; putting value 8 at index 7
        ; get value of arr[0] ie rbp-32 and move it to esi
        ; since accessing any element is just pointer arithmetic, accessing an element is constant time - O(1).
        mov     eax, DWORD PTR [rbp-32]
        mov     esi, eax
        mov     edi, OFFSET FLAT:.LC0
        mov     eax, 0
        call    "printf"
        mov     eax, 0
        leave
        ret
```

### Pros
- Fast access: As shown, accessing an element in arrays is just pointer arithmetic therefore accessing elements is really fast.
- Memory efficiency: Since data is stored in a single block of data, it allows efficient allocation.
- Cache locality: Since data is stored in a contiguous way, when a block is cached in CPU caches, there's a high chance due to locality the needed data is in cache therefore reducing access time.

### Cons
- Fixed Size: An array's size is fixed at allocation therefore growing beyond its capacity requires reallocating and copying the whole array. Insertion and deletion also become O(n) since elements must be shifted to make or close a gap.
- Memory allocation issues: Allocated large arrays can cause fragmentation in memory leading to memory exhaustion

## Two Pointers
The two pointer approach uses two pointers say `i` and `j` which store the index values of elements and their values are modified when a condition is met. These are useful as they can help reduce complexity of certain algorithms that may use nested loops for solving the same problem, thus reducing time complexity from `O(n^2)` to `O(n)`.

Based on how the pointers move relative to each other, there are a few different patterns:
- Opposite Direction / Converging Pointers: We have one pointer at the start and the other pointer at the end, and they move towards each other until they meet or cross. Here's some question:
  - [167. Two Sum II - Input Array Is Sorted](https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/description/)
  - [125. Valid Palindrome](https://leetcode.com/problems/valid-palindrome/description/)
  - [11. Container With Most Water](https://leetcode.com/problems/container-with-most-water/description/)
  - [15. 3Sum](https://leetcode.com/problems/3sum/description/)
  - [151. Reverse Words in a String](https://leetcode.com/problems/reverse-words-in-a-string/description/)
  - [42. Trapping Rain Water](https://leetcode.com/problems/trapping-rain-water/description/)
- Same Direction Pointers: Both pointers start at the same position but move under different conditions or at different speeds. Here's some question:
  - [26. Remove Duplicates from Sorted Array](https://leetcode.com/problems/remove-duplicates-from-sorted-array/description/)
  - [283. Move Zeroes](https://leetcode.com/problems/move-zeroes/description/)
  - [75. Sort Colors](https://leetcode.com/problems/sort-colors/description/)
  - [27. Remove Element](https://leetcode.com/problems/remove-element/description/)
  - [287. Find the Duplicate Number](https://leetcode.com/problems/find-the-duplicate-number/description/)
  - [142. Linked List Cycle II](https://leetcode.com/problems/linked-list-cycle-ii/description/)
- Fixed Gap Pointers: Both pointers move in the same direction while maintaining a fixed distance between them, forming a window of fixed size that can be analyzed. Here's some question:
  - [Maximum Sum Subarray of Size K](https://www.geeksforgeeks.org/dsa/find-maximum-minimum-sum-subarray-size-k/)

## Cyclic Sort
Cyclic sort is a sorting algorithm that sort the elements in O(n) time and O(1) space where elements must be in a tightly bounded range such as `0..n-1` or `1..n`, one occurence each or occasionally with some duplicates or missing values. It tries to put the elements in their place such as element `v` would go on index `v - 1`. Walk through the array; at each position, if the current element isn't already at its correct index, swap it there. Repeat until the element at the current position is correct, then move on.

```cpp
size_t n = nums.size();
size_t i = 0;
while(i < n) {
  size_t correct_idx = nums[i] - 1;
  if(nums[i] != nums[correct_idx]) {
    swap(nums[i], nums[correct_idx]);
  } else {
    i++;
  }
}

```

For example, sorting `[3, 1, 5, 4, 2]` (values `1..5`, so value `v` belongs at index `v - 1`):

| i | array before | correct_idx for nums[i] | action |
|---|---|---|---|
| 0 | `[3, 1, 5, 4, 2]` | 3 -> idx 2 | nums[0] != nums[2], swap |
| 0 | `[5, 1, 3, 4, 2]` | 5 -> idx 4 | nums[0] != nums[4], swap |
| 0 | `[2, 1, 3, 4, 5]` | 2 -> idx 1 | nums[0] != nums[1], swap |
| 0 | `[1, 2, 3, 4, 5]` | 1 -> idx 0 | nums[0] == nums[0], i++ |
| 1 | `[1, 2, 3, 4, 5]` | 2 -> idx 1 | nums[1] == nums[1], i++ |
| 2 | `[1, 2, 3, 4, 5]` | 3 -> idx 2 | nums[2] == nums[2], i++ |
| 3 | `[1, 2, 3, 4, 5]` | 4 -> idx 3 | nums[3] == nums[3], i++ |
| 4 | `[1, 2, 3, 4, 5]` | 5 -> idx 4 | nums[4] == nums[4], i++ |

> each swap places one element permanently, so across the whole array there are at most `n` swaps total, keeping the algorithm O(n) despite the nested loop.

## Leetcode Practice

- [268. Missing Number (Easy)](https://leetcode.com/problems/missing-number/description/) — find the missing number
- [448. Find All Numbers Disappeared in an Array (Easy)](https://leetcode.com/problems/find-all-numbers-disappeared-in-an-array/description/) — find all missing numbers
- [645. Set Mismatch (Easy)](https://leetcode.com/problems/set-mismatch/description/) — find the corrupt pair: one duplicate and one missing value

- [287. Find the Duplicate Number (Medium)](https://leetcode.com/problems/find-the-duplicate-number/description/) — identify the duplicate under stricter space constraints
- [442. Find All Duplicates in an Array (Medium)](https://leetcode.com/problems/find-all-duplicates-in-an-array/description/) — find every duplicate in the range `1..n`

- [41. First Missing Positive (Hard)](https://leetcode.com/problems/first-missing-positive/description/) — ignore values outside `1..n`, then find the first misplaced index
