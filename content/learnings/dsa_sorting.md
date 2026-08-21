---
title: "DSA: Sorting Algorithms"
description: Learning about comparison-based and non-comparison sorting algorithms with leetcode questions for practice.
author: quantinium
date: '2026-08-21'
categories:
  - data-structures-and-algorithms
  - sorting
published: true
---

# Insertion Sort
Builds up a sorted portion of the array one element at a time. Take the next element, shift every larger element in the sorted portion one step right, then drop it into the gap. Optimal for small or nearly-sorted arrays since it does almost no work when things are already in order.

```cpp
void insertion_sort(vector<int> &nums) {
  for(int i = 1; i < nums.size(); i++) {
    int key = nums[i];
    int j = i - 1;
    while(j >= 0 && nums[j] > key) {
      nums[j + 1] = nums[j];
      j--;
    }
    nums[j + 1] = key;
  }
}
```

```
arr = [5, 2, 4, 6, 1, 3]

i=1: key=2, shift 5 right      -> [2, 5, 4, 6, 1, 3]
i=2: key=4, shift 5 right      -> [2, 4, 5, 6, 1, 3]
i=3: key=6, no shift needed    -> [2, 4, 5, 6, 1, 3]
i=4: key=1, shift 6,5,4,2 right -> [1, 2, 4, 5, 6, 3]
i=5: key=3, shift 6,5,4 right   -> [1, 2, 3, 4, 5, 6]
```

## Complexity
- Time Complexity
  - Best: O(n)
  - Average: O(n^2)
  - Worst: O(n^2)

- Space Complexity
  - Best: O(1)
  - Average: O(1)
  - Worst: O(1)

# Merge Sort
Divide-and-conquer: split the array in half recursively until each piece has one element, then merge sorted halves back together using an auxiliary array. Stable and guarantees O(n log n) regardless of input, unlike quicksort.

```cpp
void merge(vector<int> &nums, int low, int mid, int high) {
  vector<int> temp;
  int left = low, right = mid + 1;
  while(left <= mid && right <= high) {
    if(nums[left] <= nums[right]) temp.push_back(nums[left++]);
    else temp.push_back(nums[right++]);
  }
  while(left <= mid) temp.push_back(nums[left++]);
  while(right <= high) temp.push_back(nums[right++]);
  for(int i = low; i <= high; i++) nums[i] = temp[i - low];
}

void merge_sort(vector<int> &nums, int low, int high) {
  if(low >= high) return;
  int mid = low + (high - low) / 2;
  merge_sort(nums, low, mid);
  merge_sort(nums, mid + 1, high);
  merge(nums, low, mid, high);
}
```

```
arr = [6, 3, 9, 2]

split: [6, 3]   [9, 2]
split: [6][3]   [9][2]
merge: [3, 6]   [2, 9]
merge: [2, 3, 6, 9]
```

## Complexity
- Time Complexity
  - Best: O(n log n)
  - Average: O(n log n)
  - Worst: O(n log n)

- Space Complexity
  - Best: O(n)
  - Average: O(n)
  - Worst: O(n)

# Quicksort
Pick a pivot, partition the array so smaller elements land left and larger ones land right, then recurse on both partitions. In-place and fast in practice, but a bad pivot choice (e.g. picking the last element on already-sorted input) degrades to O(n^2) — random or median-of-three pivot selection avoids this. The partition step is also the basis of **quickselect**, used to find the kth largest/smallest element in O(n) average time without fully sorting (LC 215).

```cpp
int partition(vector<int> &nums, int low, int high) {
  int pivot = nums[high];
  int i = low - 1;
  for(int j = low; j < high; j++) {
    if(nums[j] < pivot) {
      i++;
      swap(nums[i], nums[j]);
    }
  }
  swap(nums[i + 1], nums[high]);
  return i + 1;
}

void quick_sort(vector<int> &nums, int low, int high) {
  if(low >= high) return;
  int pivot_index = partition(nums, low, high);
  quick_sort(nums, low, pivot_index - 1);
  quick_sort(nums, pivot_index + 1, high);
}
```

```
arr = [5, 2, 8, 1, 9], pivot = 9 (last element)

j=0: 5<9, swap(i=0,j=0) -> [5, 2, 8, 1, 9]
j=1: 2<9, swap(i=1,j=1) -> [5, 2, 8, 1, 9]
j=2: 8<9, swap(i=2,j=2) -> [5, 2, 8, 1, 9]
j=3: 1<9, swap(i=3,j=3) -> [5, 2, 8, 1, 9]
place pivot at i+1=4    -> [5, 2, 8, 1, 9], pivot_index = 4

recurse on [5, 2, 8, 1] with pivot=1, then on the rest, until sorted
```

## Complexity
- Time Complexity
  - Best: O(n log n)
  - Average: O(n log n)
  - Worst: O(n^2)

- Space Complexity
  - Best: O(log n)
  - Average: O(log n)
  - Worst: O(n)

# Heap Sort
Build a max-heap from the array, then repeatedly swap the root (the max) with the last unsorted element, shrink the heap by one, and sift the new root down. In-place unlike merge sort, and guarantees O(n log n) unlike quicksort. Also worth knowing because heaps/priority queues show up constantly in interviews independent of sorting (top-k, merge-k-lists, running median).

```cpp
void heapify(vector<int> &nums, int n, int i) {
  int largest = i, left = 2 * i + 1, right = 2 * i + 2;
  if(left < n && nums[left] > nums[largest]) largest = left;
  if(right < n && nums[right] > nums[largest]) largest = right;
  if(largest != i) {
    swap(nums[i], nums[largest]);
    heapify(nums, n, largest);
  }
}

void heap_sort(vector<int> &nums) {
  int n = nums.size();
  for(int i = n / 2 - 1; i >= 0; i--) heapify(nums, n, i);
  for(int i = n - 1; i > 0; i--) {
    swap(nums[0], nums[i]);
    heapify(nums, i, 0);
  }
}
```

```
arr = [4, 10, 3, 5, 1]

build max-heap             -> [10, 5, 3, 4, 1]

swap(0,4) -> [1, 5, 3, 4, 10], heapify(0..3) -> [5, 4, 3, 1, 10]
swap(0,3) -> [1, 4, 3, 5, 10], heapify(0..2) -> [4, 1, 3, 5, 10]
swap(0,2) -> [3, 1, 4, 5, 10], heapify(0..1) -> [3, 1, 4, 5, 10]
swap(0,1) -> [1, 3, 4, 5, 10]

sorted: [1, 3, 4, 5, 10]
```

## Complexity
- Time Complexity
  - Best: O(n log n)
  - Average: O(n log n)
  - Worst: O(n log n)

- Space Complexity
  - Best: O(1)
  - Average: O(1)
  - Worst: O(1)

# Counting Sort
Trades the comparison model for knowledge about the keys: works when values are integers in a small known range `[0, k]`. Count how many times each value occurs, turn counts into prefix sums to get final positions, then place elements stably (iterate from the back to preserve original relative order of equal keys).

```cpp
void counting_sort(vector<int> &nums) {
  int k = *max_element(nums.begin(), nums.end());
  vector<int> count(k + 1, 0);
  for(int x : nums) count[x]++;
  for(int i = 1; i <= k; i++) count[i] += count[i - 1];

  vector<int> output(nums.size());
  for(int i = (int)nums.size() - 1; i >= 0; i--) {
    output[--count[nums[i]]] = nums[i];
  }
  nums = output;
}
```

```
arr = [1, 4, 1, 2, 4], k = 4

count      = [0, 2, 1, 0, 2]   (index = value)
prefix sum = [0, 2, 3, 3, 5]   (count[i] = # elements <= i)

place from right (stable):
nums[4]=4 -> output[4]=4, count[4]=4
nums[3]=2 -> output[2]=2, count[2]=2
nums[2]=1 -> output[1]=1, count[1]=1
nums[1]=4 -> output[3]=4, count[4]=3
nums[0]=1 -> output[0]=1, count[1]=0

output = [1, 1, 2, 4, 4]
```

## Complexity
- Time Complexity
  - Best: O(n + k)
  - Average: O(n + k)
  - Worst: O(n + k)

- Space Complexity
  - Best: O(n + k)
  - Average: O(n + k)
  - Worst: O(n + k)

# Bucket Sort
Generalizes counting sort to values spread over a wider or non-integer range: distribute elements into buckets covering equal-sized sub-ranges, sort each bucket individually (insertion sort works well since buckets stay small), then concatenate. Assumes a roughly uniform distribution — a skewed input dumps everything into one bucket and degrades toward O(n^2).

```cpp
void bucket_sort(vector<float> &nums) {
  int n = nums.size();
  vector<vector<float>> buckets(n);

  for(float x : nums) {
    int idx = n * x; // assumes x is in [0, 1)
    buckets[idx].push_back(x);
  }

  for(auto &bucket : buckets) {
    sort(bucket.begin(), bucket.end()); // insertion sort in practice
  }

  int i = 0;
  for(auto &bucket : buckets) {
    for(float x : bucket) nums[i++] = x;
  }
}
```

```
arr = [0.78, 0.17, 0.39, 0.26, 0.72, 0.94], n = 6

bucket[0] (0.00-0.16): []
bucket[1] (0.16-0.33): [0.17, 0.26]
bucket[2] (0.33-0.50): [0.39]
bucket[3] (0.50-0.66): []
bucket[4] (0.66-0.83): [0.78, 0.72] -> sorted [0.72, 0.78]
bucket[5] (0.83-1.00): [0.94]

concatenate: [0.17, 0.26, 0.39, 0.72, 0.78, 0.94]
```

## Complexity
- Time Complexity
  - Best: O(n + k)
  - Average: O(n + k)
  - Worst: O(n^2)

- Space Complexity
  - Best: O(n + k)
  - Average: O(n + k)
  - Worst: O(n + k)

# Radix Sort
Sorts fixed-width integers digit by digit, from least significant to most significant, using counting sort as a **stable** subroutine at each digit position. Stability is not optional here — if a digit pass reorders equal-digit elements, it destroys the ordering established by previous, less significant digits.

```cpp
void counting_sort_by_digit(vector<int> &nums, int exp) {
  int n = nums.size();
  vector<int> output(n);
  vector<int> count(10, 0);

  for(int x : nums) count[(x / exp) % 10]++;
  for(int i = 1; i < 10; i++) count[i] += count[i - 1];

  for(int i = n - 1; i >= 0; i--) {
    int digit = (nums[i] / exp) % 10;
    output[--count[digit]] = nums[i];
  }
  nums = output;
}

void radix_sort(vector<int> &nums) {
  int max_val = *max_element(nums.begin(), nums.end());
  for(int exp = 1; max_val / exp > 0; exp *= 10) {
    counting_sort_by_digit(nums, exp);
  }
}
```

```
arr = [170, 45, 75, 90, 802, 24, 2, 66]

sort by 1s digit   (exp=1):   [170, 90, 802, 2, 24, 45, 75, 66]
sort by 10s digit  (exp=10):  [802, 2, 24, 45, 66, 170, 75, 90]
sort by 100s digit (exp=100): [2, 24, 45, 66, 75, 90, 170, 802]
```

## Complexity
- Time Complexity
  - Best: O(d*(n + k))
  - Average: O(d*(n + k))
  - Worst: O(d*(n + k))

  where `d` is the number of digits in the largest number and `k` is the base (10 for decimal digits).

- Space Complexity
  - Best: O(n + k)
  - Average: O(n + k)
  - Worst: O(n + k)

# Leetcode Practice

## Insertion Sort
- [147. Insertion Sort List (Medium)](https://leetcode.com/problems/insertion-sort-list/description/)

## Merge Sort
- [912. Sort an Array (Medium)](https://leetcode.com/problems/sort-an-array/description/)
- [148. Sort List (Medium)](https://leetcode.com/problems/sort-list/description/)
- [23. Merge k Sorted Lists (Hard)](https://leetcode.com/problems/merge-k-sorted-lists/description/)
- [315. Count of Smaller Numbers After Self (Hard)](https://leetcode.com/problems/count-of-smaller-numbers-after-self/description/)

## Quicksort / Quickselect
- [215. Kth Largest Element in an Array (Medium)](https://leetcode.com/problems/kth-largest-element-in-an-array/description/)
- [973. K Closest Points to Origin (Medium)](https://leetcode.com/problems/k-closest-points-to-origin/description/)
- [280. Wiggle Sort (Medium)](https://leetcode.com/problems/wiggle-sort/description/)

## Heap Sort / Heaps
- [1046. Last Stone Weight (Easy)](https://leetcode.com/problems/last-stone-weight/description/)
- [295. Find Median from Data Stream (Hard)](https://leetcode.com/problems/find-median-from-data-stream/description/)

## Counting / Bucket / Radix Sort
- [75. Sort Colors (Medium)](https://leetcode.com/problems/sort-colors/description/)
- [347. Top K Frequent Elements (Medium)](https://leetcode.com/problems/top-k-frequent-elements/description/)
- [451. Sort Characters By Frequency (Medium)](https://leetcode.com/problems/sort-characters-by-frequency/description/)
- [164. Maximum Gap (Hard)](https://leetcode.com/problems/maximum-gap/description/)
