---
title: "DSA: Binary Trees"
description: Learning about Binary Trees
author: quantinium
date: '2026-09-05'
categories:
  - data-structures-and-algorithms
  - tree
  - binary-tree
published: true
---

A binary tree is a tree in which each node has at most two children. The two child positions are distinct: one is the **left child** and the other is the **right child**. A node may have no children, one child, or two children.

Some properties of binary tree are:
- **Max nodes at level `l`:** at most `2^l` nodes.
- **Max nodes at height `h`:** at most `2^(h+1) − 1` nodes (all levels completely filled).
- **Min height for `N` nodes:** `⌊log₂ N⌋`.
- **Min levels for `L` leaves:** `⌈log₂ L⌉`.
- **Full binary tree:** leaves `L = T + 1`, where `T` = internal nodes with two children.
- **Total edges:** `n − 1` edges for a tree with `n` nodes.

## Types of Binary Trees
### Full Binary Tree
A full binary tree is a binary tree in which every node has either **zero** children or **exactly two** children. No node is allowed to have only one child.

```
          1
        /   \
       2     3
      / \   / \
     4   5 6   7
```

Nodes `1`, `2`, and `3` each have two children. Nodes `4`, `5`, `6`, and `7` have none, so this is full.

### Perfect Binary Tree
A perfect binary tree is a full binary tree in which all leaf nodes are at the same level. Every level is completely filled.

```
              1
           /     \
          2       3
        /  \     /  \
       4    5   6    7
```

For a perfect binary tree with height `h` measured in edges:

```
number of nodes  = 2^(h + 1) - 1
number of leaves = 2^h
```

### Complete Binary Tree
A complete binary tree has every level fully filled except possibly its last level. Its final level must be filled from **left to right**, with no gaps between nodes.

```
              1
           /     \
          2       3
        /  \     /
       4    5   6
```

This is **not** complete. There is a gap where `2`'s right child should be, but a node appears later on the same level.

### Balanced Binary Tree
A balanced binary tree keeps its height relatively small, usually `O(log n)`, so operations do not degrade into linked-list-like walks. The exact rule depends on the kind of balanced tree.

For the common height-balanced definition, every node satisfies:

```
abs(height(left subtree) - height(right subtree)) <= 1
```

```
              1
           /     \
          2       3
        /  \       \
       4    5       6
```

### Degenerate or Skewed Binary Tree
A degenerate binary tree is one in which every parent has only one child. It behaves like a linked list. It may be left-skewed or right-skewed.

```
left-skewed:          right-skewed:

      1                    1
     /                      \
    2                        2
   /                          \
  3                            3
 /                              \
4                                4
```

For `n` nodes, a skewed tree has height `n - 1`, so DFS uses `O(n)` stack space. A Binary Search Tree with values inserted in sorted order can become skewed unless it is self-balancing.

## Leetcode problems
- [2236. Root Equals Sum of Children (Easy)](https://leetcode.com/problems/root-equals-sum-of-children/description/)
- [572. Subtree of Another Tree (Easy)](https://leetcode.com/problems/subtree-of-another-tree/description/)
- [951. Flip Equivalent Binary Trees (Medium)](https://leetcode.com/problems/flip-equivalent-binary-trees/description/)
- [965. Univalued Binary Tree (Easy)](https://leetcode.com/problems/univalued-binary-tree/description/)
- [222. Count Complete Tree Nodes (Easy)](https://leetcode.com/problems/count-complete-tree-nodes/description/)
- [129. Sum Root to Leaf Numbers (Medium)](https://leetcode.com/problems/sum-root-to-leaf-numbers/description/)
- [988. Smallest String Starting From Leaf (Medium)](https://leetcode.com/problems/smallest-string-starting-from-leaf/description/)
- [617. Merge Two Binary Trees (Easy)](https://leetcode.com/problems/merge-two-binary-trees/description/)
- [814. Binary Tree Pruning (Medium)](https://leetcode.com/problems/binary-tree-pruning/description/)
- [2331. Evaluate Boolean Binary Tree (Easy)](https://leetcode.com/problems/evaluate-boolean-binary-tree/description/)
- [1676. Lowest Common Ancestor of a Binary Tree IV (Medium)](https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree-iv/description/)
- [1026. Maximum Difference Between Node and Ancestor (Medium)](https://leetcode.com/problems/maximum-difference-between-node-and-ancestor/description/)
- [662. Maximum Width of Binary Tree (Medium)](https://leetcode.com/problems/maximum-width-of-binary-tree/description/)
- [958. Check Completeness of a Binary Tree (Medium)](https://leetcode.com/problems/check-completeness-of-a-binary-tree/description/)
- [1028. Recover a Tree From Preorder Traversal (Hard)](https://leetcode.com/problems/recover-a-tree-from-preorder-traversal/description/)
