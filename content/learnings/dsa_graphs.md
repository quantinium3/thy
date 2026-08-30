---
title: "DSA: Graphs"
description: Learning about graph representations, DFS and BFS, connected components, cycle detection, topological sort, union find, bipartite checks, Dijkstra, 0-1 BFS, Bellman-Ford, Floyd-Warshall, MST, DP on DAGs, implicit state graphs, bridges and articulation points, with leetcode questions for practice.
author: quantinium
date: '2026-08-31'
categories:
  - data-structures-and-algorithms
  - graphs
published: false
---

# Graphs
A graph is a set of vertices `V` and a set of edges `E`, where each edge connects two vertices.

## Vocabulary
- Directed vs undirected: An undirected edge `{u, v}` is traversable both ways. A directed edge `u -> v` is one way. `[a, b]` in the input means "a before b", "a depends on b" or "a to b".
- Weighted vs unweighted: A weight is a cost, distance, time or probability on an edge. Unweighted really means "every edge costs 1".
- Degree: Number of incident edges. For directed graphs it splits into `indegree` and `outdegree`. `sum(degree) = 2 * E` for undirected graphs.
- Path, walk, cycle.: A path visits distinct vertices; a cycle is a path that returns to its start. A graph with no cycle is acyclic.
- Connected component: A maximal set of vertices mutually reachable by ignoring edge direction. A graph is connected when it has exactly one component.
- DAG: Directed acyclic graph. This is the shape that makes topological sort and DP-on-graphs possible.
- Tree: A connected undirected graph with `n` vertices and exactly `n - 1` edges and no cycle. Any two of those three conditions imply the third.
- Simple graph: No self loops (`u -> u`) and no parallel edges.
- Dense vs sparse: Dense means `E ~ V^2`, sparse means `E ~ V`. This decides the representation and it decides whether an `O(V^2)` algorithm is fine.

```
undirected                directed (a DAG)          weighted
   1 --- 2                  1 --> 2                  1 --4-- 2
   |   / |                  |     |                  |       |
   |  /  |                  v     v                  7       1
   | /   |                  3 --> 4                  |       |
   3 --- 4                                           3 --2-- 4
```

# Representations
There are three ways to store the same graph, and the choice is a memory/time trade, not a matter of taste.

## Adjacency list
An array of `n` vectors, `g[u]` holding the neighbours of `u`.

```cpp
// n nodes labelled 0..n-1, edges given as {u, v}
vector<vector<int>> g(n);
for (auto &e : edges) {
  g[e[0]].push_back(e[1]);
  g[e[1]].push_back(e[0]);   // delete this line for a directed graph
}
```

Weighted graphs store a pair instead:

```cpp
vector<vector<pair<int, int>>> g(n);   // g[u] = list of {neighbour, weight}
for (auto &e : edges) {
  g[e[0]].push_back({e[1], e[2]});
  g[e[1]].push_back({e[0], e[2]});
}
```

`O(V + E)` space, and iterating the neighbours of `u` costs `O(deg(u))`, which is what makes a full traversal `O(V + E)` instead of `O(V^2)`.

## Adjacency matrix
`m[u][v] = 1` (or the weight) when the edge exists.

```cpp
vector<vector<int>> m(n, vector<int>(n, 0));
for (auto &e : edges) m[e[0]][e[1]] = m[e[1]][e[0]] = 1;
```

`O(V^2)` space, `O(1)` edge lookup, but `O(V)` to list one node's neighbours. Use it when `n` is small (roughly `n <= 500`), when the problem *hands* you a matrix, or when the algorithm is `O(V^3)` anyway (Floyd-Warshall).

## Edge list
Just the `{u, v, w}` triples, unsorted.

## Implicit graphs
The node is never materialised; it is a state, and neighbours are computed on demand by a transition function.

- A grid: the node is a cell, the neighbours are `dr/dc` offsets. Covered in the matrix notes; `V = n * m`, `E = 4 * n * m`.
- A word ladder: the node is a word, the neighbours are the words one letter away.
- A lock/puzzle: the node is the dial configuration, the neighbours are one-move turns.
- A number: the node is the current value, the neighbours are the values one legal operation away.

## Choosing
| | adjacency list | matrix | edge list |
|---|---|---|---|
| space | O(V + E) | O(V^2) | O(E) |
| "is u-v an edge?" | O(deg u) | O(1) | O(E) |
| iterate neighbours | O(deg u) | O(V) | O(E) |
| good for | almost everything | dense, small n, Floyd-Warshall | Kruskal, Bellman-Ford |

# Traversal
Every graph algorithm below is DFS or BFS with something extra recorded on the side. Get these two exactly right and the rest is bookkeeping.

## DFS
Go as deep as possible, then back up. Recursive is the readable form:

```cpp
void dfs(int u, vector<vector<int>> &g, vector<bool> &vis) {
  vis[u] = true;
  // preorder work here
  for (int v : g[u])
    if (!vis[v]) dfs(v, g, vis);
  // postorder work here: everything below u is finished
}
```

Mark `vis[u]` on *entry*, before the loop. Marking it after the loop means two adjacent nodes recurse into each other forever.

The iterative version matters when `n` is `10^5` and the graph is a path, because the recursion would be 100k frames deep and blow the stack:

```cpp
void dfs(int s, vector<vector<int>> &g, vector<bool> &vis) {
  vector<int> st{s};
  while (!st.empty()) {
    int u = st.back(); st.pop_back();
    if (vis[u]) continue;                 // the same node can be pushed many times
    vis[u] = true;
    for (int v : g[u])
      if (!vis[v]) st.push_back(v);
  }
}
```

> Recursive DFS marks on push, iterative DFS marks on pop and needs the `if (vis[u]) continue` guard. Iterative DFS also visits neighbours in reverse order, which only matters if the problem cares about order.

## BFS
Expand in rings of increasing distance. The first time BFS reaches a node it has reached it by a shortest path.

```cpp
vector<int> bfs(int s, vector<vector<int>> &g) {
  vector<int> dist(g.size(), -1);
  queue<int> q;
  dist[s] = 0;
  q.push(s);
  while (!q.empty()) {
    int u = q.front(); q.pop();
    for (int v : g[u]) {
      if (dist[v] != -1) continue;        // already discovered, its dist is <= this one
      dist[v] = dist[u] + 1;
      q.push(v);
    }
  }
  return dist;
}
```

> **Mark visited when you push, not when you pop.** If you mark on pop, a node with `k` in-edges is enqueued `k` times, and on a dense graph the queue grows to `O(E)` and the "shortest" distance you write may be a later, longer one. This is the single most common BFS bug.

When you only need the number of steps and not per-node distances, drain the queue one level at a time:

```cpp
int steps = 0;
while (!q.empty()) {
  int sz = q.size();                      // freeze the level boundary
  while (sz--) {
    int u = q.front(); q.pop();
    if (u == target) return steps;
    for (int v : g[u]) if (!vis[v]) { vis[v] = true; q.push(v); }
  }
  steps++;
}
```

## Multi-source BFS
If the question is "distance to the *nearest* source" and there are many sources, do not BFS once per source for `O(S * (V + E))`. Push every source at distance 0 and run one BFS. The rings then expand from all of them simultaneously and each node is settled by whichever source is closest.

```cpp
for (int s : sources) { dist[s] = 0; q.push(s); }
// identical loop from here
```

That turns "rotting oranges", "01 matrix" and "walls and gates" into a single `O(V + E)` pass.

## DFS or BFS?
- shortest path / minimum steps, unweighted -> **BFS**, always
- "does a path exist", connectivity, components, flood fill -> either, DFS is shorter
- anything needing a postorder ("finish the subtree, then decide") -> **DFS**
- level structure, "how many moves" -> **BFS**
- very deep graph, `n >= 10^5` -> **BFS** or iterative DFS, to avoid a stack overflow

# Pattern 1: Connected Components and Flood Fill
Loop over every node; each time you find an unvisited one, you have found a new component, so run a traversal to consume the whole thing.

```cpp
int countComponents(int n, vector<vector<int>> &g) {
  vector<bool> vis(n, false);
  int comps = 0;
  for (int i = 0; i < n; i++) {
    if (vis[i]) continue;
    comps++;
    dfs(i, g, vis);
  }
  return comps;
}
```

The outer loop is not optional. A graph is not guaranteed connected, and a solution that starts one traversal from node 0 silently answers a different question. The total cost is still `O(V + E)` because each node and edge is touched once across all traversals.

Variants that are the same code with a different accumulator: component size (return a count from the DFS), component colouring (write an id instead of a bool), "largest component", "is the whole graph one component".

# Pattern 2: Cycle Detection
The rule differs by direction and getting the wrong one is a guaranteed wrong answer.

## Undirected: don't walk back down the edge you came from
Any edge to an already-visited node that is not your parent closes a cycle.

```cpp
bool dfs(int u, int parent, vector<vector<int>> &g, vector<bool> &vis) {
  vis[u] = true;
  for (int v : g[u]) {
    if (!vis[v]) {
      if (dfs(v, u, g, vis)) return true;
    } else if (v != parent) {
      return true;                        // back edge -> cycle
    }
  }
  return false;
}
```

> The `v != parent` trick assumes a simple graph. With parallel edges, `u - v` twice is a genuine cycle that this reports as "just my parent", so track the *edge index* you arrived on rather than the node. A self loop is also a cycle and this misses it.

## Directed: a cycle is a back edge to a node still on the recursion stack
"Already visited" is not enough, because a directed graph can reach the same node twice by two different finished paths without any cycle (a diamond). You need three states.

```cpp
// 0 = unvisited, 1 = on the current dfs stack, 2 = fully explored
bool dfs(int u, vector<vector<int>> &g, vector<int> &color) {
  color[u] = 1;
  for (int v : g[u]) {
    if (color[v] == 1) return true;                 // back edge into the active path
    if (color[v] == 0 && dfs(v, g, color)) return true;
  }
  color[u] = 2;                                     // done, safe to reach again later
  return false;
}
```

> The alternative for directed graphs is Kahn's algorithm below: if the topological order comes out shorter than `n`, whatever is missing sits on a cycle.

# Pattern 3: Topological Sort
Only defined on a DAG. It is a linear order of the vertices where every edge points forward. The mental model for the entire "course schedule / build order / task dependency" family is: *repeatedly take a node nothing depends on any more*.

## Kahn's algorithm (BFS on indegrees)
```cpp
vector<int> topo(int n, vector<vector<int>> &g) {
  vector<int> indeg(n, 0), order;
  for (int u = 0; u < n; u++)
    for (int v : g[u]) indeg[v]++;

  queue<int> q;
  for (int i = 0; i < n; i++)
    if (indeg[i] == 0) q.push(i);        // nothing blocks these

  while (!q.empty()) {
    int u = q.front(); q.pop();
    order.push_back(u);
    for (int v : g[u])
      if (--indeg[v] == 0) q.push(v);    // u was v's last blocker
  }

  if ((int)order.size() != n) return {}; // fewer than n -> a cycle absorbed the rest
  return order;
}
```

Two properties worth internalising:

- **It doubles as cycle detection for free.** A node on a cycle never reaches indegree 0.
- **Swap the queue for a `priority_queue` and you get the lexicographically smallest valid order.** That single change is the whole difference in a family of problems.

If you also drain the queue level by level, each level is a set of tasks that can run in parallel, which answers "minimum time to finish everything" questions.

## DFS postorder
```cpp
void dfs(int u, vector<vector<int>> &g, vector<int> &color, vector<int> &out) {
  color[u] = 1;
  for (int v : g[u]) {
    if (color[v] == 1) { /* cycle: bail out */ }
    if (color[v] == 0) dfs(v, g, color, out);
  }
  color[u] = 2;
  out.push_back(u);                       // pushed only after all descendants
}
// reverse(out) is a topological order
```

A node is appended only once everything reachable from it is already appended, so reversing gives a valid order. Use whichever you like; Kahn is easier to get right under pressure and gives cycle detection with no extra code.

# Pattern 4: Union Find (Disjoint Set Union)
DSU answers "are these two in the same group?" and "merge these two groups" in effectively `O(1)`. It is the right tool when edges arrive one at a time, when the question is about connectivity rather than paths, and when there is no need to know *how* two nodes connect.

```cpp
struct DSU {
  vector<int> parent, sz;
  int comps;

  DSU(int n) : parent(n), sz(n, 1), comps(n) {
    iota(parent.begin(), parent.end(), 0);   // everyone is their own root
  }

  int find(int x) {
    return parent[x] == x ? x : parent[x] = find(parent[x]);   // path compression
  }

  bool unite(int a, int b) {
    a = find(a); b = find(b);
    if (a == b) return false;                // already connected: this edge closes a cycle
    if (sz[a] < sz[b]) swap(a, b);           // union by size, keeps trees shallow
    parent[b] = a;
    sz[a] += sz[b];
    comps--;
    return true;
  }

  bool connected(int a, int b) { return find(a) == find(b); }
};
```

Path compression plus union by size gives `O(alpha(n))` amortised per operation, where `alpha` is the inverse Ackermann function and is below 5 for any `n` you will ever see. Treat it as constant.

The `false` return from `unite` is doing real work: it means "these were already in one component", which is simultaneously a cycle detection, a redundant-edge detector, and Kruskal's rejection rule.

## DSU or DFS?
| | DSU | DFS/BFS |
|---|---|---|
| edges arrive incrementally / online | yes | no, must rebuild |
| needs the actual path | no | yes |
| directed graphs | no | yes |
| answering many "same component?" queries | yes | no |
| needs distances or levels | no | yes |

For static "count the components" you can use either. For "count components after each added edge", DSU is the only sane option.

# Pattern 5: Bipartite Check (2-colouring)
A graph is bipartite when the vertices split into two sets with no edge inside a set. Equivalently: it is 2-colourable, equivalently it has no odd-length cycle. Every problem phrased as "split people into two groups so that enemies are separated" is this.

```cpp
bool isBipartite(vector<vector<int>> &g) {
  int n = g.size();
  vector<int> color(n, -1);
  for (int s = 0; s < n; s++) {
    if (color[s] != -1) continue;           // again: the graph may be disconnected
    queue<int> q;
    color[s] = 0;
    q.push(s);
    while (!q.empty()) {
      int u = q.front(); q.pop();
      for (int v : g[u]) {
        if (color[v] == -1) {
          color[v] = color[u] ^ 1;
          q.push(v);
        } else if (color[v] == color[u]) {
          return false;                     // an edge inside one side
        }
      }
    }
  }
  return true;
}
```

DSU solves it too, by uniting each node with the "opposite" copy of its neighbour in a `2n` sized structure, but colouring is clearer.

# Pattern 6: Dijkstra
Shortest path with **non-negative** weights. The invariant: pop the closest unsettled node, and its distance is final, because any other route to it would have to pass through something already at least as far away. Negative weights destroy that argument, which is exactly why Dijkstra is wrong on them.

```cpp
vector<long long> dijkstra(int s, vector<vector<pair<int, int>>> &g) {
  const long long INF = LLONG_MAX / 4;
  vector<long long> dist(g.size(), INF);
  priority_queue<pair<long long, int>, vector<pair<long long, int>>, greater<>> pq;

  dist[s] = 0;
  pq.push({0, s});
  while (!pq.empty()) {
    auto [d, u] = pq.top(); pq.pop();
    if (d > dist[u]) continue;             // stale entry from a since-improved push
    for (auto [v, w] : g[u]) {
      if (d + w < dist[v]) {
        dist[v] = d + w;
        pq.push({dist[v], v});
      }
    }
  }
  return dist;
}
```

Three details that decide whether it is correct:

- **Lazy deletion.** `std::priority_queue` cannot decrease a key, so you push a duplicate and discard the outdated pop with `if (d > dist[u]) continue`. Without that line it still terminates but does redundant work, and any per-pop side effect runs too often.
- **Push the pair as `{distance, node}`,** so the default tuple comparison orders by distance.
- **Use `long long`** for accumulated distance. Path sums overflow `int` far more easily than individual weights suggest.

`O(E log V)` with a binary heap. On a dense graph an `O(V^2)` array scan is actually faster, but that rarely comes up.

## The Dijkstra family
Dijkstra generalises to any edge cost that is *monotone*, i.e. extending a path never makes it better. Swap the relaxation and the comparator and the same skeleton solves:

- minimum total cost, cost = sum of weights — the standard case
- maximum probability path — `max`-heap, relax with `p[u] * w`, since probabilities in `[0, 1]` only shrink
- minimise the *maximum* edge on the path (bottleneck / "minimum effort") — relax with `max(d[u], w)` instead of `d[u] + w`
- shortest path where the node is a *state*, e.g. `(city, stops used)` or `(cell, remaining fuel)` — `dist` becomes 2-D

If the cost can decrease along a path, it is not Dijkstra.

## 0-1 BFS
When every weight is 0 or 1, a deque replaces the heap: a 0-edge keeps the same distance so it goes to the front, a 1-edge goes to the back. The deque stays sorted by construction and you get `O(V + E)` instead of `O(E log V)`.

```cpp
deque<int> dq;
dist[s] = 0;
dq.push_front(s);
while (!dq.empty()) {
  int u = dq.front(); dq.pop_front();
  for (auto [v, w] : g[u]) {
    if (dist[u] + w < dist[v]) {
      dist[v] = dist[u] + w;
      w == 0 ? dq.push_front(v) : dq.push_back(v);
    }
  }
}
```

This is the tool for "minimum number of obstacles to remove" and "minimum cost to make the grid path valid" style problems, where most moves are free.

# Pattern 7: Bellman-Ford
Handles **negative** weights, and detects negative cycles. Relax every edge, `V - 1` times. After `k` rounds, `dist` is correct for every path using at most `k` edges, and any simple path uses at most `V - 1`.

```cpp
vector<long long> bellmanFord(int n, int s, vector<array<int, 3>> &edges) {
  const long long INF = LLONG_MAX / 4;
  vector<long long> dist(n, INF);
  dist[s] = 0;
  for (int i = 0; i < n - 1; i++) {
    bool changed = false;
    for (auto &[u, v, w] : edges) {
      if (dist[u] != INF && dist[u] + w < dist[v]) {
        dist[v] = dist[u] + w;
        changed = true;
      }
    }
    if (!changed) break;                    // early exit, nothing left to improve
  }
  // one extra pass that still relaxes something => a negative cycle is reachable
  return dist;
}
```

`O(V * E)`, which is why it is a last resort. But the "after `k` rounds you know the best path using at most `k` edges" property is not just an implementation detail; it is the direct answer to "cheapest flight with at most K stops". For that variant you must relax against a **snapshot** of the previous round, otherwise a single round chains multiple edges and uses more stops than allowed.

# Pattern 8: Floyd-Warshall
All pairs shortest paths in `O(V^3)`, worth it only when `n` is small (say `n <= 400`) and you need distances between *every* pair.

```cpp
// d[i][j] initialised to the edge weight, INF if absent, 0 on the diagonal
for (int k = 0; k < n; k++)
  for (int i = 0; i < n; i++)
    for (int j = 0; j < n; j++)
      if (d[i][k] + d[k][j] < d[i][j])
        d[i][j] = d[i][k] + d[k][j];
```

`k` must be the **outermost** loop. The invariant is "after iteration `k`, `d[i][j]` is the best path using only `0..k` as intermediates", and any other loop order destroys it. Handles negative edges; a negative `d[i][i]` afterwards means a negative cycle.

# Pattern 9: Minimum Spanning Tree
The cheapest set of `V - 1` edges that keeps an undirected graph connected. Both algorithms are greedy and both are correct for the same reason (the cut property: the lightest edge crossing any cut is in some MST).

## Kruskal: sort edges, add if it doesn't close a cycle
```cpp
sort(edges.begin(), edges.end(),
     [](auto &a, auto &b) { return a[2] < b[2]; });
DSU dsu(n);
long long total = 0;
for (auto &e : edges)
  if (dsu.unite(e[0], e[1])) total += e[2];
// dsu.comps > 1 afterwards means the graph was disconnected: no spanning tree exists
```

`O(E log E)`, dominated by the sort. This is the natural fit when the input is an edge list.

## Prim: grow one tree, always take the cheapest edge leaving it
```cpp
priority_queue<pair<int, int>, vector<pair<int, int>>, greater<>> pq;
vector<bool> in(n, false);
long long total = 0;
pq.push({0, 0});
while (!pq.empty()) {
  auto [w, u] = pq.top(); pq.pop();
  if (in[u]) continue;
  in[u] = true;
  total += w;
  for (auto [v, wt] : g[u])
    if (!in[v]) pq.push({wt, v});
}
```

`O(E log V)`. Prefer Prim when the graph is dense or given implicitly (e.g. "connect all points, cost = Manhattan distance"), because materialising all `n^2 / 2` edges for Kruskal may not fit.

# Pattern 10: DP on a DAG
Once a graph is acyclic, "longest path", "number of paths", "cheapest path" become plain DP, because a topological order is a valid evaluation order. Two ways to write it:

- **Memoised DFS.** `f(u) = combine over v in g[u] of f(v)`. The memo is safe precisely because there are no cycles.
- **Iterate the topological order** and push values forward.

```cpp
int f(int u, vector<vector<int>> &g, vector<int> &memo) {
  if (memo[u] != -1) return memo[u];
  int best = 1;
  for (int v : g[u]) best = max(best, 1 + f(v, g, memo));
  return memo[u] = best;
}
```

`O(V + E)`, since each node is computed once and each edge is relaxed once. Longest path in a *general* graph is NP-hard; on a DAG it is linear. That gap is why "is this acyclic?" is worth checking before anything else.

The grid version of this ("longest increasing path in a matrix") is the same code, with the implicit DAG formed by only stepping to strictly larger cells.

# Pattern 11: State-Space Search
The node is not given; you invent it. This is the highest-leverage pattern in graph interviews, because the problem never says "graph".

The recipe:

1. **What is a state?** Everything you need to know to decide the future, and nothing more. If you carry too much, the state space explodes; too little and you cache wrong answers.
2. **What is an edge?** One legal move, costing 1 (BFS) or a weight (Dijkstra).
3. **What is the goal test?**
4. **How do you dedupe?** A `visited` set over states, not over the underlying object.

Examples of the state:

- word ladder: the current word — neighbours are one-letter changes
- lock with dials: the 4-digit configuration — neighbours are 8 single-dial turns
- keys and doors in a grid: `(row, col, bitmask of keys held)` — the same cell is worth revisiting with a different key set, so a plain 2-D `visited` is wrong
- minimum jumps: `(index)` with same-value teleports, plus the trick of clearing a value's bucket after first use to keep it linear
- flights with at most K stops: `(city, stops used)`

The failure mode is always dimension: if revisiting a cell/word/number can ever be useful under different circumstances, those circumstances belong *in the state*.

# Pattern 12: Reverse the Graph
When the question is "who can reach X" instead of "what can X reach", building the reverse adjacency list and running one traversal from X beats running one traversal per node.

```cpp
vector<vector<int>> rg(n);
for (int u = 0; u < n; u++)
  for (int v : g[u]) rg[v].push_back(u);
```

`O(V + E)` to build. The same instinct handles "cells that can flow to the ocean" (start at the ocean and walk uphill), "nodes with no incoming edge" (indegree = 0), and "eventual safe nodes" (reverse topological / Kahn on the reversed graph).

# Pattern 13: Bridges and Articulation Points
An edge is a **bridge** when removing it increases the number of components; a vertex is an **articulation point** when removing it does. Tarjan finds all of them in one DFS by recording, for each node, the earliest discovery time reachable from its subtree.

```cpp
int timer = 0;
vector<int> tin, low;   // discovery time, and lowest tin reachable from the subtree

void dfs(int u, int parent, vector<vector<int>> &g, vector<vector<int>> &bridges) {
  tin[u] = low[u] = timer++;
  for (int v : g[u]) {
    if (v == parent) continue;
    if (tin[v] != -1) {
      low[u] = min(low[u], tin[v]);        // back edge: u can climb to v's level
    } else {
      dfs(v, u, g, bridges);
      low[u] = min(low[u], low[v]);
      if (low[v] > tin[u])                 // v's subtree has no way around edge u-v
        bridges.push_back({u, v});
    }
  }
}
```

The condition reads directly: `low[v] > tin[u]` means nothing under `v` can reach `u` or above except through the edge itself, so that edge is critical. This is the answer to "critical connections in a network" and shows up in redundancy/reliability framing.

# Pattern 14: Eulerian Path
A walk that uses every **edge** exactly once. Exists in a directed graph when every vertex has `indegree == outdegree`, except possibly one start (`out = in + 1`) and one end (`in = out + 1`), and all edges are in one component. Hierholzer builds it in `O(E)`:

```cpp
void dfs(const string &u, map<string, multiset<string>> &g, vector<string> &route) {
  auto &dest = g[u];
  while (!dest.empty()) {
    string v = *dest.begin();
    dest.erase(dest.begin());              // consume the edge, never the node
    dfs(v, g, route);
  }
  route.push_back(u);                      // append on the way out
}
// reverse(route) is the itinerary
```

Two things distinguish it from ordinary DFS: you mark **edges** used, not nodes (a node may be revisited), and you append on the *postorder*, then reverse. Do not confuse it with a Hamiltonian path (every vertex once), which is NP-hard.

# Pattern 15: Strongly Connected Components
In a directed graph, an SCC is a maximal set where every node reaches every other. Contracting each SCC to a single node always yields a DAG, which is the useful part: it turns any directed graph into one you can topologically sort.

Kosaraju is the easiest to remember: DFS the graph pushing nodes on finish, then DFS the *reversed* graph popping in that order; each traversal is one SCC. `O(V + E)`. Tarjan does it in a single pass with the same `low`/`tin` machinery as bridges. This is rare on leetcode, but knowing that "SCC condensation is a DAG" is what unlocks the occasional hard problem.

# Complexity
Let `V` be the vertex count and `E` the edge count.

| algorithm | time | space |
|---|---|---|
| DFS / BFS | O(V + E) | O(V) |
| connected components | O(V + E) | O(V) |
| cycle detection (either kind) | O(V + E) | O(V) |
| topological sort (Kahn or DFS) | O(V + E) | O(V) |
| bipartite check | O(V + E) | O(V) |
| union find, m operations | O(m * alpha(n)) ~ O(m) | O(V) |
| Dijkstra (binary heap) | O(E log V) | O(V + E) |
| 0-1 BFS | O(V + E) | O(V) |
| Bellman-Ford | O(V * E) | O(V) |
| Floyd-Warshall | O(V^3) | O(V^2) |
| Kruskal | O(E log E) | O(V) |
| Prim (heap) | O(E log V) | O(V + E) |
| DP on a DAG | O(V + E) | O(V) |
| bridges / articulation points | O(V + E) | O(V) |
| Hierholzer (Eulerian path) | O(E log E) with a multiset | O(E) |

On a grid, substitute `V = n * m` and `E = 4 * n * m`, so everything collapses to `O(n * m)`.

# Picking the Pattern
Read the problem statement and match the phrasing:

| the problem says | reach for |
|---|---|
| "minimum number of steps/moves", no weights | BFS |
| "shortest path", weights, all non-negative | Dijkstra |
| "shortest path", some weight is negative | Bellman-Ford |
| "shortest path between every pair", n small | Floyd-Warshall |
| "at most k edges/stops" | Bellman-Ford by rounds, or state = (node, k) |
| weights are only 0 and 1 | 0-1 BFS with a deque |
| "minimise the maximum edge on the path" | Dijkstra with `max` relaxation, or binary search + BFS |
| "can all tasks be finished", "order to take courses" | topological sort |
| "is there a cycle" | 3-colour DFS (directed) / parent DFS (undirected) |
| "how many groups/islands/provinces" | components via DFS or DSU |
| "edges are added one at a time" | union find |
| "split into two groups" | bipartite check |
| "connect everything at minimum cost" | MST (Kruskal or Prim) |
| "longest path" and the graph is acyclic | DP on the DAG |
| "which edge/node breaks the network" | bridges / articulation points |
| "use every road exactly once" | Eulerian path (Hierholzer) |
| the input is words, dials, numbers, configurations | implicit graph, state-space BFS |

# Leetcode Practice

## Traversal and components
- [547. Number of Provinces (Medium)](https://leetcode.com/problems/number-of-provinces/description/) — adjacency matrix in, components out; do it once with DFS and once with DSU
- [323. Number of Connected Components in an Undirected Graph (Medium, premium)](https://leetcode.com/problems/number-of-connected-components-in-an-undirected-graph/description/) — the bare version of the pattern
- [1971. Find if Path Exists in Graph (Easy)](https://leetcode.com/problems/find-if-path-exists-in-graph/description/) — build the list, then one traversal
- [797. All Paths From Source to Target (Medium)](https://leetcode.com/problems/all-paths-from-source-to-target/description/) — DFS with backtracking, no visited array needed on a DAG
- [1791. Find Center of Star Graph (Easy)](https://leetcode.com/problems/find-center-of-star-graph/description/) — a degree observation, not a traversal
- [133. Clone Graph (Medium)](https://leetcode.com/problems/clone-graph/description/) — the map from old node to new node *is* the visited set
- [2101. Detonate the Maximum Bombs (Medium)](https://leetcode.com/problems/detonate-the-maximum-bombs/description/) — the hard part is realising the edges are directed

## BFS shortest path
- [1926. Nearest Exit from Entrance in Maze (Medium)](https://leetcode.com/problems/nearest-exit-from-entrance-in-maze/description/) — grid BFS, careful with the entrance itself
- [994. Rotting Oranges (Medium)](https://leetcode.com/problems/rotting-oranges/description/) — multi-source, level by level
- [542. 01 Matrix (Medium)](https://leetcode.com/problems/01-matrix/description/) — the reason multi-source exists
- [286. Walls and Gates (Medium, premium)](https://leetcode.com/problems/walls-and-gates/description/) — same shape as 542
- [127. Word Ladder (Hard)](https://leetcode.com/problems/word-ladder/description/) — implicit graph; compare building all edges vs generating neighbours
- [752. Open the Lock (Medium)](https://leetcode.com/problems/open-the-lock/description/) — state = the dial string, deadends are the visited set
- [815. Bus Routes (Hard)](https://leetcode.com/problems/bus-routes/description/) — choose whether the node is a stop or a route
- [1091. Shortest Path in Binary Matrix (Medium)](https://leetcode.com/problems/shortest-path-in-binary-matrix/description/) — 8 directions
- [909. Snakes and Ladders (Medium)](https://leetcode.com/problems/snakes-and-ladders/description/) — the index math is the whole problem

## Cycle detection
- [207. Course Schedule (Medium)](https://leetcode.com/problems/course-schedule/description/) — the canonical directed cycle question
- [261. Graph Valid Tree (Medium, premium)](https://leetcode.com/problems/graph-valid-tree/description/) — n-1 edges and connected
- [684. Redundant Connection (Medium)](https://leetcode.com/problems/redundant-connection/description/) — DSU, the edge whose `unite` returns false
- [685. Redundant Connection II (Hard)](https://leetcode.com/problems/redundant-connection-ii/description/) — directed, and the two failure cases interact
- [802. Find Eventual Safe States (Medium)](https://leetcode.com/problems/find-eventual-safe-states/description/) — colours, or Kahn on the reversed graph

## Topological sort
- [210. Course Schedule II (Medium)](https://leetcode.com/problems/course-schedule-ii/description/) — return the order, not just the boolean
- [269. Alien Dictionary (Hard, premium)](https://leetcode.com/problems/alien-dictionary/description/) — deriving the edges is 80% of it
- [310. Minimum Height Trees (Medium)](https://leetcode.com/problems/minimum-height-trees/description/) — peel leaves like Kahn until 1 or 2 remain
- [1462. Course Schedule IV (Medium)](https://leetcode.com/problems/course-schedule-iv/description/) — reachability closure, topo order or Floyd-Warshall on booleans
- [2115. Find All Possible Recipes from Given Supplies (Medium)](https://leetcode.com/problems/find-all-possible-recipes-from-given-supplies/description/)
- [1857. Largest Color Value in a Directed Graph (Hard)](https://leetcode.com/problems/largest-color-value-in-a-directed-graph/description/) — topo order carrying a 26-wide DP
- [2050. Parallel Courses III (Hard)](https://leetcode.com/problems/parallel-courses-iii/description/) — longest path on a DAG via Kahn

## Union find
- [721. Accounts Merge (Medium)](https://leetcode.com/problems/accounts-merge/description/) — union on emails, group at the end
- [990. Satisfiability of Equality Equations (Medium)](https://leetcode.com/problems/satisfiability-of-equality-equations/description/) — process all `==` before any `!=`
- [1319. Number of Operations to Make Network Connected (Medium)](https://leetcode.com/problems/number-of-operations-to-make-network-connected/description/) — spare cables vs components - 1
- [947. Most Stones Removed with Same Row or Column (Medium)](https://leetcode.com/problems/most-stones-removed-with-same-row-or-column/description/) — union rows with columns
- [305. Number of Islands II (Hard, premium)](https://leetcode.com/problems/number-of-islands-ii/description/) — the incremental case DFS cannot handle
- [839. Similar String Groups (Hard)](https://leetcode.com/problems/similar-string-groups/description/)
- [1697. Checking Existence of Edge Length Limited Paths (Hard)](https://leetcode.com/problems/checking-existence-of-edge-length-limited-paths/description/) — sort queries and edges together, add edges as the limit grows

## Bipartite
- [785. Is Graph Bipartite? (Medium)](https://leetcode.com/problems/is-graph-bipartite/description/)
- [886. Possible Bipartition (Medium)](https://leetcode.com/problems/possible-bipartition/description/) — the same thing wearing a story
- [1042. Flower Planting With No Adjacent (Medium)](https://leetcode.com/problems/flower-planting-with-no-adjacent/description/) — greedy colouring with 4 colours and degree ≤ 3

## Dijkstra and weighted paths
- [743. Network Delay Time (Medium)](https://leetcode.com/problems/network-delay-time/description/) — plain Dijkstra, answer is the max distance
- [1514. Path with Maximum Probability (Medium)](https://leetcode.com/problems/path-with-maximum-probability/description/) — max-heap, multiply instead of add
- [1631. Path With Minimum Effort (Medium)](https://leetcode.com/problems/path-with-minimum-effort/description/) — relax with `max`, or binary search + BFS
- [778. Swim in Rising Water (Hard)](https://leetcode.com/problems/swim-in-rising-water/description/) — same bottleneck idea on a grid
- [1976. Number of Ways to Arrive at Destination (Medium)](https://leetcode.com/problems/number-of-ways-to-arrive-at-destination/description/) — Dijkstra carrying a path count
- [2290. Minimum Obstacle Removal to Reach Corner (Hard)](https://leetcode.com/problems/minimum-obstacle-removal-to-reach-corner/description/) — 0-1 BFS
- [1368. Minimum Cost to Make at Least One Valid Path in a Grid (Hard)](https://leetcode.com/problems/minimum-cost-to-make-at-least-one-valid-path-in-a-grid/description/) — 0-1 BFS again
- [787. Cheapest Flights Within K Stops (Medium)](https://leetcode.com/problems/cheapest-flights-within-k-stops/description/) — Bellman-Ford rounds, or state = (city, stops)
- [1928. Minimum Cost to Reach Destination in Time (Hard)](https://leetcode.com/problems/minimum-cost-to-reach-destination-in-time/description/) — state = (node, time)

## All-pairs
- [1334. Find the City With the Smallest Number of Neighbors at a Threshold Distance (Medium)](https://leetcode.com/problems/find-the-city-with-the-smallest-number-of-neighbors-at-a-threshold-distance/description/) — n ≤ 100, Floyd-Warshall
- [399. Evaluate Division (Medium)](https://leetcode.com/problems/evaluate-division/description/) — weighted graph, DFS per query or weighted DSU

## Minimum spanning tree
- [1584. Min Cost to Connect All Points (Medium)](https://leetcode.com/problems/min-cost-to-connect-all-points/description/) — implicit complete graph, Prim beats Kruskal
- [1135. Connecting Cities With Minimum Cost (Medium, premium)](https://leetcode.com/problems/connecting-cities-with-minimum-cost/description/) — plain Kruskal
- [1489. Find Critical and Pseudo-Critical Edges in MST (Hard)](https://leetcode.com/problems/find-critical-and-pseudo-critical-edges-in-minimum-spanning-tree/description/) — build the MST repeatedly with one edge forced in or out

## DP on a DAG
- [329. Longest Increasing Path in a Matrix (Hard)](https://leetcode.com/problems/longest-increasing-path-in-a-matrix/description/) — the implicit DAG is what makes memoisation legal
- [2246. Longest Path With Different Adjacent Characters (Hard)](https://leetcode.com/problems/longest-path-with-different-adjacent-characters/description/) — the DAG is a tree, the combine is "best two children"
- [2192. All Ancestors of a Node in a Directed Acyclic Graph (Medium)](https://leetcode.com/problems/all-ancestors-of-a-node-in-a-directed-acyclic-graph/description/)
- [1136. Parallel Courses (Medium, premium)](https://leetcode.com/problems/parallel-courses/description/) — longest chain = number of semesters

## Bridges, articulation points, SCC
- [1192. Critical Connections in a Network (Hard)](https://leetcode.com/problems/critical-connections-in-a-network/description/) — Tarjan, straight out of the box
- [1568. Minimum Number of Days to Disconnect Island (Hard)](https://leetcode.com/problems/minimum-number-of-days-to-disconnect-island/description/) — the answer is at most 2; articulation points explain why

## Eulerian path
- [332. Reconstruct Itinerary (Hard)](https://leetcode.com/problems/reconstruct-itinerary/description/) — Hierholzer with a sorted multiset per node
- [753. Cracking the Safe (Hard)](https://leetcode.com/problems/cracking-the-safe/description/) — de Bruijn sequence as an Eulerian circuit
