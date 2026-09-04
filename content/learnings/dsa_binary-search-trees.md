---
title: "DSA: Binary Search Trees"
description: Learning the ordering invariant, operations, and applications of Binary Search Trees.
author: quantinium
date: '2026-09-05'
categories:
  - data-structures-and-algorithms
  - tree
  - binary-search-tree
published: true
---

# Binary Search Tree

A Binary Search Tree (BST) is a binary tree with an additional ordering rule. For every node:
```text
every value in the left subtree  < node value
every value in the right subtree > node value

              8
           /     \
          3      10
        /  \       \
       1    6       14
           / \      /
          4   7    13
```

For example, `4` is valid below `6` because it is smaller than `6`, but it is also larger than `3` and smaller than `8`. A value must satisfy the constraints created by every ancestor on its path.


## Why a BST is useful
At each node, comparison removes one entire subtree from consideration:

```text
search for 7:

8  ->  7 < 8, go left
3  ->  7 > 3, go right
6  ->  7 > 6, go right
7  ->  found
```
That is binary search but on trees. It is fast only when the tree is reasonably balanced.

## Search
To search for `target`:

1. If the current node is null, the value is absent.
2. If `target == node->val`, it is found.
3. If `target < node->val`, continue in the left subtree.
4. Otherwise, continue in the right subtree.

```cpp
TreeNode* searchBST(TreeNode* root, int target) {
  while (root && root->val != target) {
    root = target < root->val ? root->left : root->right;
  }
  return root;
}
```

- [700. Search in a Binary Search Tree (Easy)](https://leetcode.com/problems/search-in-a-binary-search-tree/description/)

## Insert
Insertion follows the same path as search, stopping at a missing child. The new value is attached there as a leaf, which preserves the BST invariant.

```text
insert 5 into:          after insertion:

       8                       8
      / \                     / \
     3  10                   3  10
      \                       \
       6                       6
                              /
                             5
```
- [701. Insert into a Binary Search Tree (Medium)](https://leetcode.com/problems/insert-into-a-binary-search-tree/description/)

## Minimum and maximum
The smallest value is the leftmost node; the largest is the rightmost node.

```text
minimum: keep moving left until left is null
maximum: keep moving right until right is null
```

- [530. Minimum Absolute Difference in BST (Easy)](https://leetcode.com/problems/minimum-absolute-difference-in-bst/description/)

## In-order traversal is sorted
In-order traversal visits:

```text
left subtree -> node -> right subtree
```

Because every left-subtree value is smaller and every right-subtree value is larger, an in-order traversal of a valid BST returns values in strictly increasing order.

```text
in-order of the example: 1 3 4 6 7 8 10 13 14
```

This fact powers several common operations:

## Successor and predecessor

The **in-order successor** of a node is the next larger value. The **in-order predecessor** is the next smaller value.

For a node with a right subtree, its successor is the leftmost node of that right subtree.

```text
       8
        \
        10
       /
      9

successor of 8 = 9
```

For a node with a left subtree, its predecessor is the rightmost node of that left subtree. If the required subtree does not exist, walk down from the root and remember the last ancestor that could be the answer.

- [1586. Binary Search Tree Iterator II (Medium)](https://leetcode.com/problems/binary-search-tree-iterator-ii/description/)

## Validate a BST
Comparing a node only with its immediate children is not enough.

```text
        8
       / \
      3  10
       \
        9
```

`9` is larger than its parent `3`, but it is in the left subtree of `8`, so the tree is invalid.

The reliable method passes an allowed range down the tree:

```text
root:          (-infinity, +infinity)
left of 8:     (-infinity, 8)
right of 8:    (8, +infinity)
right of 3:    (3, 8)
```

Every node must lie strictly inside its range.

- [98. Validate Binary Search Tree (Medium)](https://leetcode.com/problems/validate-binary-search-tree/description/)

## Lowest Common Ancestor in a BST
The Lowest Common Ancestor (LCA) of two nodes is the deepest node whose subtree contains both nodes.

The ordering rule makes this simpler than LCA in a general binary tree:

```text
if p and q are both smaller than root: go left
if p and q are both larger than root:  go right
otherwise: root is the LCA
```

The “otherwise” case means the two values split at the current node, or one of them is the current node.

- [235. Lowest Common Ancestor of a Binary Search Tree (Medium)](https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/description/)

## Delete
Deletion is the core BST operation because the ordering must still hold afterwards.

### Case 1: leaf node
Remove it directly.

```text
    6                 6
   / \      ->         \
  4   7                 7
```

### Case 2: node with one child
Connect its parent directly to its only child.
```text
    6                 7
     \
      7
```

### Case 3: node with two children
Replace the node's value with its in-order successor: the smallest value in its right subtree. Then delete that successor from its original position. The successor has no left child, so its final deletion is Case 1 or Case 2.
```text
        8                    10
       / \      ->          /  \
      3  10                3   14
          \
          14
```

The in-order predecessor—the largest value in the left subtree—works equally well. Choose one convention and apply it consistently.

- [450. Delete Node in a BST (Medium)](https://leetcode.com/problems/delete-node-in-a-bst/description/)

## Complexity
Let `h` be the height of the tree.
| Operation | Time | Extra space, iterative |
|---|---:|---:|
| Search | `O(h)` | `O(1)` |
| Insert | `O(h)` | `O(1)` |
| Minimum / maximum | `O(h)` | `O(1)` |
| Successor / predecessor | `O(h)` | `O(1)` |
| Delete | `O(h)` | `O(1)` |
| In-order traversal | `O(n)` | `O(h)` |

For a balanced tree, `h = O(log n)`. For a completely skewed tree, `h = O(n)`.

```text
balanced:                 skewed after sorted insertion:

       4                         1
     /   \                        \
    2     6                        2
   / \   / \                        \
  1  3 5  7                        3
                                    \
                                     4
```

- [1382. Balance a Binary Search Tree (Medium)](https://leetcode.com/problems/balance-a-binary-search-tree/description/)

# Leetcode Practice
- [700. Search in a Binary Search Tree (Easy)](https://leetcode.com/problems/search-in-a-binary-search-tree/description/)
- [938. Range Sum of BST (Easy)](https://leetcode.com/problems/range-sum-of-bst/description/)
- [530. Minimum Absolute Difference in BST (Easy)](https://leetcode.com/problems/minimum-absolute-difference-in-bst/description/)
- [108. Convert Sorted Array to Binary Search Tree (Easy)](https://leetcode.com/problems/convert-sorted-array-to-binary-search-tree/description/)
- [701. Insert into a Binary Search Tree (Medium)](https://leetcode.com/problems/insert-into-a-binary-search-tree/description/)
- [98. Validate Binary Search Tree (Medium)](https://leetcode.com/problems/validate-binary-search-tree/description/)
- [230. Kth Smallest Element in a BST (Medium)](https://leetcode.com/problems/kth-smallest-element-in-a-bst/description/)
- [235. Lowest Common Ancestor of a Binary Search Tree (Medium)](https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/description/)
- [450. Delete Node in a BST (Medium)](https://leetcode.com/problems/delete-node-in-a-bst/description/)
- [173. Binary Search Tree Iterator (Medium)](https://leetcode.com/problems/binary-search-tree-iterator/description/)
- [669. Trim a Binary Search Tree (Medium)](https://leetcode.com/problems/trim-a-binary-search-tree/description/)
- [1008. Construct Binary Search Tree from Preorder Traversal (Medium)](https://leetcode.com/problems/construct-binary-search-tree-from-preorder-traversal/description/)
- [1382. Balance a Binary Search Tree (Medium)](https://leetcode.com/problems/balance-a-binary-search-tree/description/)
- [1586. Binary Search Tree Iterator II (Medium)](https://leetcode.com/problems/binary-search-tree-iterator-ii/description/
- [1373. Maximum Sum BST in Binary Tree (Hard)](https://leetcode.com/problems/maximum-sum-bst-in-binary-tree/description/)
- [1569. Number of Ways to Reorder Array to Get Same BST (Hard)](https://leetcode.com/problems/number-of-ways-to-reorder-array-to-get-same-bst/description/)

