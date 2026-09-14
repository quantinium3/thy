---
title: "DSA: Topological Sort"
description: Learning about topological ordering of DAGs using Kahn's algorithm and DFS reverse postorder, along with cycle detection in directed graphs, with leetcode questions for practice.
author: quantinium
date: '2026-09-13'
categories:
  - data-structures-and-algorithms
  - graphs
  - topological-sort
published: false
---

# Topological Sort
A topological order of a directed graph lists the vertices so that for every edge `u -> v`, u comes before v.

```text
(0)---->(1)---->(3)---->(5)
 |               ^       ^
 |               |       |
 +----->(2)------+       |
         |               |
         +----->(4)------+

adj[0] = {1, 2}
adj[1] = {3}
adj[2] = {3, 4}
adj[3] = {5}
adj[4] = {5}
adj[5] = {}
```
`0 1 2 3 4 5`, `0 2 1 4 3 5` and `0 2 4 1 3 5` are all valid order.

There are two algorithms for finding the topological sort

## Kahn's Algorithm
A vertex with 0 in-degree has no remaining prerequisites, so it's safe to output first and delete its outgoing edges. This would decrease neighbouring vertex in-degrees as well and any neighbour that hit `0` also becomes safe and we can output its value. Repeat the process.

If the graph has a cycle, the vertices in it depend on each other, so their in-degree never drops to `0` and they never enter the queue. So if `order` ends up with fewer than `n` vertices, there is a cycle and we return `{}`.

```cpp
vector<int> toposort(const vector<vector<int>>& adj) {
  int n = adj.size();
  vector<int> indeg(n, 0);
  for(int i = 0; i < n; i++) {
    for(int v : adj[i]) {
      indeg[v]++;
    }
  }

  queue<int> q;
  for(int i = 0; i < n; i++) {
    if(indeg[i] == 0) {
      q.push(i);
    }
  }

  vector<int> order;
  while(!q.empty()) {
    int curr = q.front();
    q.pop();
    order.push_back(curr);
    for(int v : adj[curr]) {
      if(--indeg[v] == 0) {
        q.push(v);
      }
    }
  }

  if(order.size() != n) return {};
  return order;
}
```

## DFS based
Run a DFS, and add a vertex to the list only after all of its neighbours are finished. So every vertex ends up after everything it points to. Reversing that list gives the topological order.

Each vertex is in one of three states:
- `0`: not visited yet
- `1`: currently in the DFS path (we're still exploring from it)
- `2`: fully done

If we reach a vertex that is in state `1`, we have come back to a vertex on our current path. That means there is a cycle, so no topological order exists and we return `{}`. A vertex in state `2` was already finished from another path, so we skip it.

```cpp
bool dfs(int u, const vector<vector<int>>& adj, vector<int>& state, vector<int>& order) {
  state[u] = 1;
  for(int v : adj[u]) {
    if(state[v] == 1) return false;
    if(state[v] == 0 && !dfs(v, adj, state, order)) return false;
  }
  state[u] = 2;
  order.push_back(u);
  return true;
}

vector<int> topo(const vector<vector<int>>& adj) {
  int n = adj.size();
  vector<int> state(n, 0), order;
  for(int i = 0; i < n; i++) {
    if(state[i] == 0 && !dfs(i, adj, state, order)) return {};
  }
  reverse(order.begin(), order.end());
  return order;
}
```

For the graph above, starting from `0`:
```text
dfs(0) -> dfs(1) -> dfs(3) -> dfs(5)
5 has no neighbours     order = [5]
3 done                  order = [5, 3]
1 done                  order = [5, 3, 1]
dfs(2) -> 3 is done, skip -> dfs(4) -> 5 is done, skip
4 done                  order = [5, 3, 1, 4]
2 done                  order = [5, 3, 1, 4, 2]
0 done                  order = [5, 3, 1, 4, 2, 0]

reverse -> 0 2 4 1 3 5
```

# Leetcode Practice
- [207. Course Schedule (Medium)](https://leetcode.com/problems/course-schedule/description/)
- [210. Course Schedule II (Medium)](https://leetcode.com/problems/course-schedule-ii/description/)
- [802. Find Eventual Safe States (Medium)](https://leetcode.com/problems/find-eventual-safe-states/description/)
- [2115. Find All Possible Recipes from Given Supplies (Medium)](https://leetcode.com/problems/find-all-possible-recipes-from-given-supplies/description/)
- [1462. Course Schedule IV (Medium)](https://leetcode.com/problems/course-schedule-iv/description/)
- [1136. Parallel Courses (Medium)](https://leetcode.com/problems/parallel-courses/description/)
- [444. Sequence Reconstruction (Medium)](https://leetcode.com/problems/sequence-reconstruction/description/)
- [2050. Parallel Courses III (Hard)](https://leetcode.com/problems/parallel-courses-iii/description/)
- [269. Alien Dictionary (Hard)](https://leetcode.com/problems/alien-dictionary/description/)
- [329. Longest Increasing Path in a Matrix (Hard)](https://leetcode.com/problems/longest-increasing-path-in-a-matrix/description/)
- [2392. Build a Matrix With Conditions (Hard)](https://leetcode.com/problems/build-a-matrix-with-conditions/description/)
- [1203. Sort Items by Groups Respecting Dependencies (Hard)](https://leetcode.com/problems/sort-items-by-groups-respecting-dependencies/description/)
