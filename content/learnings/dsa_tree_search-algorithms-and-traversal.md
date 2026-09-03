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


## Tree Traversal Techniques
Tree traversal refers to the process of visiting or accessing each node of a tree exactly once in a specific order.
There are two types of traversal techniques:
- Depth First Traversal
  - Pre-order Traversal
  - In-order Traversal
  - Post-order Traversal
- Breadth First Traversal or Level Order

### Depth First Traversal
It is a traversal algorithm that starts from a source node and follows one branch as deep as it can go, and only when it runs out of children does it backtrack to the nearest node that still has an unexplored branch.

The mechanism is a stack (LIFO): walk into a node's first child, and pop back up only when a node has no unexplored children left. Written recursively the stack is implicit - it is the call stack, and it holds exactly the path from the root down to the node being visited.

```
              1          stack: [1]         -> visit 1
            /   \        stack: [1,2]       -> visit 2
          2       3      stack: [1,2,4]     -> visit 4
        /   \       \    stack: [1,2,4,7]   -> visit 7, backtrack to 2
      4       5       6  stack: [1,2,5]     -> visit 5, backtrack to 1
     /                   stack: [1,3]       -> visit 3
    7                    stack: [1,3,6]     -> visit 6
                         order: 1 2 4 7 5 3 6
```

That is the recursive picture, where the stack is the path. There are two ways to implement DFS: recursively, and iteratively with a stack you manage yourself.

```cpp
void dfs(TreeNode* root) {
  if (!root) return;
  cout << root->val << ' ';            // visit
  dfs(root->left);
  dfs(root->right);
}

// with an explicit stack as recursion is only a way of borrowing the call stack, and a deep tree can overflow it.
void dfsIterative(TreeNode* root) {
  if (!root) return;
  stack<TreeNode*> st;
  st.push(root);
  while (!st.empty()) {
    TreeNode* curr = st.top();
    st.pop();
    cout << curr->val << ' ';
    if (curr->right) st.push(curr->right);   // right first, so left is popped first
    if (curr->left)  st.push(curr->left);
  }
}
```

> The two stacks hold different things. The call stack holds the path from the root to the current node; the explicit stack above holds nodes that have been discovered but not yet visited, which is siblings waiting their turn, not a path. Both produce the same order, but only the recursive one hands you the route to the current node for free.

- Time Complexity: `O(V + E)`
- Space Complexity: `O(h)` where `h` is the height of the tree - `O(log n)` on a balanced tree but `O(n)` on a skewed one, which is the mirror of BFS paying for the widest level instead.

#### Pre-Order Traversal
Pre-order traversal is a method in which we traverse a tree such that for each node, we visit the node first, then traverse the left subtree and then right subtree - `Root, Left, Right`.

The word "pre" refers to when the node is visited relative to its subtrees: on the way down, before either recursive call has run. A node is therefore always emitted before every one of its descendants, and an entire left subtree is emitted before the right one is touched.

```
              1          the root is emitted before anything below it
            /   \
          2       3      order: 1 2 4 7 5 3 6
        /   \       \           ^ |_____| |_|
      4       5       6         |     |      \ right subtree of 1
     /                          |     \ left subtree of 1
    7                           \ the root itself
```

Read the order back and the recursive structure is visible in it: the root, then the whole left subtree as one contiguous run, then the whole right subtree. That property holds at every node, not just the root - `4 7` is a contiguous run for the same reason.

```cpp
void preorder(TreeNode* root) {
  if (!root) return;
  cout << root->val << ' ';            // visit, then descend
  preorder(root->left);
  preorder(root->right);
}

// the same order, with the stack managed by hand
void preorderIterative(TreeNode* root) {
  if (!root) return;
  stack<TreeNode*> st;
  st.push(root);
  while (!st.empty()) {
    TreeNode* curr = st.top();
    st.pop();
    cout << curr->val << ' ';
    if (curr->right) st.push(curr->right);   // right first, so left is popped first
    if (curr->left)  st.push(curr->left);
  }
}
```

That placement decides which direction information can flow. Because the node is handled before its children, a pre-order visit can pass something *down* to them
- [113. Path Sum II](https://leetcode.com/problems/path-sum-ii/description/)
- [1448. Count Good Nodes](https://leetcode.com/problems/count-good-nodes-in-binary-tree/description/)
- [98. Validate BST](https://leetcode.com/problems/validate-binary-search-tree/description/).
- [144. Binary Tree Preorder Traversal (Easy)](https://leetcode.com/problems/binary-tree-preorder-traversal/description/) — the traversal itself, worth writing both ways
- [589. N-ary Tree Preorder Traversal (Easy)](https://leetcode.com/problems/n-ary-tree-preorder-traversal/description/) — same shape once `left/right` becomes a loop over children
- [105. Construct Binary Tree from Preorder and Inorder Traversal (Medium)](https://leetcode.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/description/) — why one sequence alone is not enough
- [1008. Construct Binary Search Tree from Preorder Traversal (Medium)](https://leetcode.com/problems/construct-binary-search-tree-from-preorder-traversal/description/) — the BST property replaces the second sequence
- [114. Flatten Binary Tree to Linked List (Medium)](https://leetcode.com/problems/flatten-binary-tree-to-linked-list/description/) — the list you are asked to build is the pre-order
- [297. Serialize and Deserialize Binary Tree (Hard)](https://leetcode.com/problems/serialize-and-deserialize-binary-tree/description/) — pre-order with null markers, so the shape survives the round trip

#### In Order Traversal
In-order traversal is a method in which we traverse a tree such that for each node, we visit the node's left subtree, then node itself and then right subtree - `Left, Root, Right`.


```cpp
void inorder(TreeNode* root) {
  if(root == nullptr) return ;
  inorder(root->left);
  cout << root->val << " ";
  inorder(root->right);
}
```

On the tree above this gives `7 4 2 5 1 3 6`.

##### Doing it iteratively
The iterative version is the one that is actually worth understanding, because unlike pre-order it is not a straight rewrite.

In pre-order a node is finished the moment it is reached - print it, push the children, never look at it again. In-order cannot do that. When the walk first arrives at a node it is not allowed to visit it yet, because everything in its left subtree has to come out first. The node has to be remembered, set aside while an unknown amount of work happens below it, and returned to afterwards. Recursion hides this: the node sits in a paused stack frame, and the frame resumes at the `cout` line on its own. Iteratively that "come back to me later" has to be built by hand, which is the whole difficulty.

```cpp
void inorderIterative(TreeNode* root) {
  stack<TreeNode*> st;
  TreeNode* curr = root;
  while (curr || !st.empty()) {
    while (curr) {                 // descend, remembering every node passed through
      st.push(curr);
      curr = curr->left;
    }
    curr = st.top();               // nothing further left, so this node is next
    st.pop();
    cout << curr->val << ' ';
    curr = curr->right;            // its left is done, so the right subtree starts fresh
  }
}
```

The loop alternates between two modes. While `curr` is non-null it is descending, pushing each node it passes so it can return to it. When `curr` becomes null the descent has bottomed out, so the top of the stack is the deepest node whose left subtree is now finished - which is exactly the next node in in-order. Visit it, then point `curr` at its right child and let the outer loop treat that as a fresh subtree under the same rules.

```
              1          curr=1,2,4,7  descend left      stack: [1,2,4,7]
            /   \        pop 7         visit 7, go right stack: [1,2,4]
          2       3      pop 4         visit 4, go right stack: [1,2]
        /   \       \    pop 2         visit 2, go right stack: [1]     curr=5
      4       5       6  push 5, pop 5 visit 5           stack: [1]
     /                   pop 1         visit 1, go right stack: []      curr=3
    7                    push 3, pop 3 visit 3, go right stack: []      curr=6
                         push 6, pop 6 visit 6           stack: []
                         order: 7 4 2 5 1 3 6
```

Three details carry the correctness:

- **The popped node is never pushed back.** That is what makes each node visited exactly once. By the time a node is popped its left subtree is provably finished, so there is no state left to track for it - no `visited` flag is needed anywhere.
- **The loop condition needs both halves.** `!st.empty()` alone fails immediately, since the stack starts empty. `curr` alone fails the moment a node with no right child is visited while ancestors are still waiting. Work remains if either there is a subtree still to descend into, or a node still waiting to be visited.
- **`curr = curr->right` is the return step.** It is the iterative spelling of the recursive function's last line. Assigning null there is fine and common - it just means the next iteration skips the descent and pops an ancestor instead.

Each node is pushed once and popped once, so it is `O(n)` time and `O(h)` space, the same as the recursive version - the stack is the same stack, just written out. Morris traversal gets the space down to `O(1)` by temporarily rewiring leaf pointers back to their in-order successor, at the cost of mutating the tree while it runs.

The reason this specific traversal earns the extra effort is that in-order on a BST emits the keys in sorted order, and the iterative form can be paused midway. That is what makes it possible to stop at the `k`th value instead of walking the whole tree, and what a BST iterator is built out of.

Some questions are as follows:
- [94. Binary Tree Inorder Traversal (Easy)](https://leetcode.com/problems/binary-tree-inorder-traversal/description/) — write it both ways
- [230. Kth Smallest Element in a BST (Medium)](https://leetcode.com/problems/kth-smallest-element-in-a-bst/description/) — stop after `k` pops instead of finishing the walk
- [173. Binary Search Tree Iterator (Medium)](https://leetcode.com/problems/binary-search-tree-iterator/description/) — the loop above, turned inside out into a class
- [98. Validate Binary Search Tree (Medium)](https://leetcode.com/problems/validate-binary-search-tree/description/) — valid exactly when the in-order sequence is strictly increasing
- [99. Recover Binary Search Tree (Medium)](https://leetcode.com/problems/recover-binary-search-tree/description/) — the two swapped nodes show up as inversions in that sequence
- [897. Increasing Order Search Tree (Easy)](https://leetcode.com/problems/increasing-order-search-tree/description/) — rebuild the tree as its own in-order


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

Some questions are as follows:
- [102. Binary Tree Level Order Traversal (Medium)](https://leetcode.com/problems/binary-tree-level-order-traversal/description/) — the level snapshot itself
- [107. Binary Tree Level Order Traversal II (Medium)](https://leetcode.com/problems/binary-tree-level-order-traversal-ii/description/) — same walk, reversed at the end
- [103. Binary Tree Zigzag Level Order Traversal (Medium)](https://leetcode.com/problems/binary-tree-zigzag-level-order-traversal/description/) — flip alternate levels
- [199. Binary Tree Right Side View (Medium)](https://leetcode.com/problems/binary-tree-right-side-view/description/) — the last node of every level
- [637. Average of Levels in Binary Tree (Easy)](https://leetcode.com/problems/average-of-levels-in-binary-tree/description/) — the level width is already the count you need
- [515. Find Largest Value in Each Tree Row (Medium)](https://leetcode.com/problems/find-largest-value-in-each-tree-row/description/) — one reduction per level
- [111. Minimum Depth of Binary Tree (Easy)](https://leetcode.com/problems/minimum-depth-of-binary-tree/description/) — the first leaf BFS meets is the answer, so it can return early where DFS cannot
- [1161. Maximum Level Sum of a Binary Tree (Medium)](https://leetcode.com/problems/maximum-level-sum-of-a-binary-tree/description/) — track the level index alongside the sum
- [993. Cousins in Binary Tree (Easy)](https://leetcode.com/problems/cousins-in-binary-tree/description/) — same level, different parent
- [116. Populating Next Right Pointers in Each Node (Medium)](https://leetcode.com/problems/populating-next-right-pointers-in-each-node/description/) — wire each node to the next one in its level
- [863. All Nodes Distance K in Binary Tree (Medium)](https://leetcode.com/problems/all-nodes-distance-k-in-binary-tree/description/) — add parent pointers to make it a graph, then BFS from the target

### Depth First Search (DFS)


Some questions are as follows:
- [104. Maximum Depth of Binary Tree (Easy)](https://leetcode.com/problems/maximum-depth-of-binary-tree/description/) — the shape every other one of these borrows
- [100. Same Tree (Easy)](https://leetcode.com/problems/same-tree/description/) — walk two trees in lockstep
- [101. Symmetric Tree (Easy)](https://leetcode.com/problems/symmetric-tree/description/) — the same walk, mirrored
- [226. Invert Binary Tree (Easy)](https://leetcode.com/problems/invert-binary-tree/description/) — swap on the way back up
- [110. Balanced Binary Tree (Easy)](https://leetcode.com/problems/balanced-binary-tree/description/) — return the height and the verdict in one pass
- [543. Diameter of Binary Tree (Easy)](https://leetcode.com/problems/diameter-of-binary-tree/description/) — the answer forms at a node, but the return value is a height
- [112. Path Sum (Easy)](https://leetcode.com/problems/path-sum/description/) — carry the running sum down
- [113. Path Sum II (Medium)](https://leetcode.com/problems/path-sum-ii/description/) — same, but push and pop the path as you go
- [257. Binary Tree Paths (Easy)](https://leetcode.com/problems/binary-tree-paths/description/) — the stack is the path, made literal
- [437. Path Sum III (Medium)](https://leetcode.com/problems/path-sum-iii/description/) — prefix sums along the current root to node path
- [236. Lowest Common Ancestor of a Binary Tree (Medium)](https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree/description/) — answer computed from what the two children report
- [1448. Count Good Nodes in Binary Tree (Medium)](https://leetcode.com/problems/count-good-nodes-in-binary-tree/description/) — pass the max seen so far downward
- [98. Validate Binary Search Tree (Medium)](https://leetcode.com/problems/validate-binary-search-tree/description/) — pass a valid range downward, not a single value
- [124. Binary Tree Maximum Path Sum (Hard)](https://leetcode.com/problems/binary-tree-maximum-path-sum/description/) — what you return upward is not what you record

