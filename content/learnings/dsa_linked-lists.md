---
title: "DSA: Linked Lists"
description: Learning about singly and doubly linked lists, the dummy node trick, reversal, fast and slow pointers for middles, cycles and nth-from-end, merging and sorting lists, and hash map plus doubly linked list designs like LRU cache, with leetcode questions for practice.
author: quantinium
date: '2026-09-14'
categories:
  - data-structures-and-algorithms
  - linked-list
published: false
---

# Linked Lists
A linked list stores elements in separate **nodes**, where each node points to the next one. Unlike an array, the nodes aren't next to each other in memory.
```text
head
 |
 v
[1] -> [2] -> [3] -> [4] -> null
```
```cpp
struct ListNode {
  int val;
  ListNode* next;
  ListNode(int x) : val(x), next(nullptr) {}
};
```
A **doubly linked list** also stores `prev`, so it can be walked in both directions, and a node can be removed without knowing the node before it.

| Operation | Array | Linked list |
|---|---|---|
| Access the `i`-th element | `O(1)` | `O(n)` |
| Insert / delete at a known node | `O(n)`, shifts elements | `O(1)` |
| Insert / delete at the front | `O(n)` | `O(1)` |
| Cache friendliness | good | poor, nodes are spread out |

In practice, arrays are usually faster. Linked lists are mostly used when you need `O(1)` removal and insertion at nodes you already hold, like in an LRU cache, and they're very common in interviews.

## Building a List
There is no container to construct, you allocate nodes and link them. Doing it by hand works for a
couple of nodes but breaks down in a loop, since the first node has no `head` to hang off yet:
```cpp
ListNode* head = new ListNode(1);
head->next = new ListNode(2);
head->next->next = new ListNode(3);
```
Instead start with a **dummy node** and a `tail` pointer that always points at the last node so far.
The dummy exists only so the first append has something to attach to, so every iteration is the
same two lines and the real head is `dummy.next`:
```cpp
ListNode* build(vector<int>& nums) {
  ListNode dummy(0);
  ListNode* tail = &dummy;
  for (int x : nums) {
    tail->next = new ListNode(x);
    tail = tail->next;
  }
  return dummy.next;
}
```
This is how you build the answer in problems like merging two sorted lists or adding two numbers,
where the output is a new list rather than a rewiring of the input.

Appending at the **front** instead builds the list backwards, and needs no dummy since `nullptr` is
a fine thing for the first node to point at. It's the same loop as reversal:
```cpp
ListNode* head = nullptr;
for (int x : nums) {
  ListNode* node = new ListNode(x);
  node->next = head;
  head = node;
}
```
Leetcode builds the list for you and never asks you to free it, so `new` without `delete` passes
there. In your own code it leaks, so walk the list and `delete` as you go, saving `next` first.
Inside a solution prefer rewiring the existing nodes over allocating new ones unless the input has
to survive: rewiring is `O(1)` space, building a fresh list is `O(n)`.

# Reversal
Walk the list and point each node back at the previous one:
```cpp
ListNode* reverse(ListNode* head) {
  ListNode* prev = nullptr;
  ListNode* curr = head;
  while(curr) {
    ListNode* next = curr->next;
    curr->next = prev;
    prev = curr;
    curr = next;
  }
  return prev;
}
```

# Fast and Slow Pointers
Move `slow` one step and `fast` two steps at a time.

**Middle**: when `fast` reaches the end, `slow` is at the middle.
```cpp
ListNode* middle(ListNode* head) {
  ListNode* slow = head;
  ListNode* fast = head;
  while(fast && fast->next) {
    slow = slow->next;
    fast = fast->next->next;
  }
  return slow; // for an even length, this is the second of the two middles
}
```

Where the cycle starts: after they meet, move one pointer back to `head`, then move both **one** step at a time. They meet again at the start of the cycle.
```cpp
ListNode* cycleStart(ListNode* head) {
  ListNode* slow = head;
  ListNode* fast = head;
  while(fast && fast->next) {
    slow = slow->next;
    fast = fast->next->next;
    if(slow == fast) {
      slow = head;
      while(slow != fast) {
        slow = slow->next;
        fast = fast->next;
      }
      return slow;
    }
  }
  return nullptr;
}
```

## Complexity
| Technique | Time | Extra space |
|---|---|---|
| Reverse / middle / cycle / `n`-th from end | `O(n)` | `O(1)` |
| Merge two sorted lists | `O(n + m)` | `O(1)` |
| Merge `k` sorted lists | `O(n log k)` | `O(k)` |
| Sort a list (merge sort) | `O(n log n)` | `O(log n)` recursive, `O(1)` bottom-up |
| LRU cache `get` / `put` | `O(1)` | `O(capacity)` |

# Leetcode Practice

## Basics
- [206. Reverse Linked List (Easy)](https://leetcode.com/problems/reverse-linked-list/description/) — [solution](/dsa/leetcode/206)
- [21. Merge Two Sorted Lists (Easy)](https://leetcode.com/problems/merge-two-sorted-lists/description/) — [solution](/dsa/leetcode/21)
- [83. Remove Duplicates from Sorted List (Easy)](https://leetcode.com/problems/remove-duplicates-from-sorted-list/description/) — [solution](/dsa/leetcode/83)
- [203. Remove Linked List Elements (Easy)](https://leetcode.com/problems/remove-linked-list-elements/description/) — [solution](/dsa/leetcode/203)
- [160. Intersection of Two Linked Lists (Easy)](https://leetcode.com/problems/intersection-of-two-linked-lists/description/) — [solution](/dsa/leetcode/160)
- [707. Design Linked List (Medium)](https://leetcode.com/problems/design-linked-list/description/) — [solution](/dsa/leetcode/707)
- [2. Add Two Numbers (Medium)](https://leetcode.com/problems/add-two-numbers/description/) — [solution](/dsa/leetcode/2)
- [328. Odd Even Linked List (Medium)](https://leetcode.com/problems/odd-even-linked-list/description/) — [solution](/dsa/leetcode/328)
- [86. Partition List (Medium)](https://leetcode.com/problems/partition-list/description/) — [solution](/dsa/leetcode/86)
- [82. Remove Duplicates from Sorted List II (Medium)](https://leetcode.com/problems/remove-duplicates-from-sorted-list-ii/description/) — [solution](/dsa/leetcode/82)
- [61. Rotate List (Medium)](https://leetcode.com/problems/rotate-list/description/) — [solution](/dsa/leetcode/61)
- [138. Copy List with Random Pointer (Medium)](https://leetcode.com/problems/copy-list-with-random-pointer/description/) — [solution](/dsa/leetcode/138)

## Fast and Slow Pointers
- [876. Middle of the Linked List (Easy)](https://leetcode.com/problems/middle-of-the-linked-list/description/) — [solution](/dsa/leetcode/876)
- [141. Linked List Cycle (Easy)](https://leetcode.com/problems/linked-list-cycle/description/) — [solution](/dsa/leetcode/141)
- [234. Palindrome Linked List (Easy)](https://leetcode.com/problems/palindrome-linked-list/description/) — [solution](/dsa/leetcode/234)
- [19. Remove Nth Node From End of List (Medium)](https://leetcode.com/problems/remove-nth-node-from-end-of-list/description/) — [solution](/dsa/leetcode/19)
- [142. Linked List Cycle II (Medium)](https://leetcode.com/problems/linked-list-cycle-ii/description/) — [solution](/dsa/leetcode/142)
- [2130. Maximum Twin Sum of a Linked List (Medium)](https://leetcode.com/problems/maximum-twin-sum-of-a-linked-list/description/) — [solution](/dsa/leetcode/2130)
- [143. Reorder List (Medium)](https://leetcode.com/problems/reorder-list/description/) — [solution](/dsa/leetcode/143)
- [287. Find the Duplicate Number (Medium)](https://leetcode.com/problems/find-the-duplicate-number/description/) — [solution](/dsa/leetcode/287)

## Reversal, Merging and Sorting
- [92. Reverse Linked List II (Medium)](https://leetcode.com/problems/reverse-linked-list-ii/description/) — [solution](/dsa/leetcode/92)
- [24. Swap Nodes in Pairs (Medium)](https://leetcode.com/problems/swap-nodes-in-pairs/description/) — [solution](/dsa/leetcode/24)
- [148. Sort List (Medium)](https://leetcode.com/problems/sort-list/description/) — [solution](/dsa/leetcode/148)
- [25. Reverse Nodes in k-Group (Hard)](https://leetcode.com/problems/reverse-nodes-in-k-group/description/) — [solution](/dsa/leetcode/25)
- [23. Merge k Sorted Lists (Hard)](https://leetcode.com/problems/merge-k-sorted-lists/description/) — [solution](/dsa/leetcode/23)

## Design
- [146. LRU Cache (Medium)](https://leetcode.com/problems/lru-cache/description/) — [solution](/dsa/leetcode/146)
- [460. LFU Cache (Hard)](https://leetcode.com/problems/lfu-cache/description/) — [solution](/dsa/leetcode/460)
