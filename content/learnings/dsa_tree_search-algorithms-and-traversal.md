---
title: "DSA: Trees - Searching algorithms and Traversal techniques"
description: Learning about Trees, Searching algorithms such as BFS and DFS and Tree Traversal techniques such as In-order, Pre-order, Post-order.
author: quantinium
date: '2026-09-02'
categories:
  - data-structures-and-algorithms
  - tree
published: true
---

# Tree
A tree is a hierarchical data structure used to organize and represent data in a parent-child relationship.

```
              1          <- root (no parent)
            /   \
          2       3      <- children of 1, siblings of each other
        /   \       \
      4       5       6  <- 5, 6 and 7 are leaves (no children)
     /
    7                    <- deepest node, so the height of the tree is 3
```

## Terminologies
- **Root Node**: The topmost node in a tree which doesnt have a parent
- **Parent Node**: The node that has successor or a child node..
- **Child Node**: The node that is successor or child of another node.
- **Leaf Node**: The node that has not successor or child nodes.
- **Sibling Node**: Nodes that share the same parent node.
- **Level**: The number of edges in path from the root node. The root node `1` is at level 0, `[2, 3]` are at level 1.
- **Ancestors**: The nodes that lie in the path from a particular node to root node.

## Search Algorithms
### Breadth First Search (BFS)
It is a traversal algorithm that starts from a source node and visits every node at distance `k` from it before visiting any node at distance `k + 1`.

The mechanism is a queue (FIFO) holding the nodes that have been discovered but not yet expanded: pop a node, push its unvisited children (or neighbours, on a graph), repeat until the queue is empty.

```
              1          queue: [1]        -> visit 1
            /   \        queue: [2, 3]     -> visit 2, 3
          2       3      queue: [4, 5, 6]  -> visit 4, 5, 6
        /   \       \    queue: [7]        -> visit 7
      4       5       6  order: 1 2 3 4 5 6 7
     /
    7
```

```cpp
void bfs(TreeNode* root) {
  if (!root) return;
  queue<TreeNode*> q;
  q.push(root);
  while (!q.empty()) {
    TreeNode* curr = q.front();
    q.pop();
    cout << curr->val << ' ';          // visit
    if (curr->left)  q.push(curr->left);
    if (curr->right) q.push(curr->right);
  }
}

// with boundaries as queue alone gives the level order but there is no way to tell which nodes lie on level and which ones lie on another.
vector<vector<int>> levelOrder(TreeNode* root) {
  if (!root) return {};
  vector<vector<int>> res;
  queue<TreeNode*> q;
  q.push(root);
  while (!q.empty()) {
    int size = q.size();               // freeze the boundary of this level
    vector<int> level;
    while (size--) {
      TreeNode* curr = q.front();
      q.pop();
      level.push_back(curr->val);
      if (curr->left)  q.push(curr->left);
      if (curr->right) q.push(curr->right);
    }
    res.push_back(level);
  }
  return res;
}
```
Because nodes come out in order of distance, the first time BFS reaches a node it has reached it by the fewest edges.
- Time Complexity: `O(V + E)`
- Space Complexity: `O(w)` where `w` is the widest level of the tree.

