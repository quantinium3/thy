---
title: "DSA: Graphs"
description: Learning about graph terminology, directed and undirected graphs, weighted and unweighted graphs, and the adjacency matrix, adjacency list and edge list representations.
author: quantinium
date: '2026-09-05'
categories:
  - data-structures-and-algorithms
  - graphs
published: true
---

# Graphs
A graph is a way to represent relationships between objects. It consists of:
- Vertices (nodes): the objects
- Edges: connections between the vertices

```text
(A)---(B)
 |   /
 |  /
(C)---(D)
```
Here, A, B, C, D are vertices, and the lines are edges.

Real-life examples:
- Social network → people are nodes, friendships are edges
- Google Maps → cities are nodes, roads are edges
- Internet → routers are nodes, cables are edges

## Types of Graphs
- Undirected Graphs: The relationship between vertices is two-way and has no direction.
- Directed Graphs: The relationship between vertices is one-way and has a direction, e.g. followers on Twitter.
- Unweighted Graphs: All edges are treated equally and we only care whether a connection exists.
- Weighted Graphs: Each edge has a value or cost associated with it. e.g. in Google Maps, the weight could be the distance or the time between cities.
- Cyclic Graphs: The graph contains at least one cycle (a path that starts and ends at the same vertex).
- Acyclic Graphs: The graph contains no cycles.
  - Tree: A connected undirected graph with no cycles.
  - DAG (Directed Acyclic Graph): A directed graph with no cycles.

## Terminologies
- Degree (Undirected Graphs): The degree of a vertex is the number of edges connected to it. If a vertex has degree `0` then it's an isolated vertex, and a vertex with degree `1` is a pendant vertex (a leaf, when the graph is a tree).
- In-Degree (Directed Graphs): The number of edges coming into a vertex.
- Out-Degree (Directed Graphs): The number of edges coming out of a vertex.
- Path: A sequence of edges that connects a sequence of vertices.
- Connected Graph: An undirected graph where there is a valid path between every pair of vertices. No node or group of nodes is cut off from the rest.
- Strongly Connected: A directed graph where there is a path from every node to every other node in both directions.
- Weakly Connected: A directed graph that would be connected if we ignored the direction of the edges.
- Sparse Graph: A graph with a relatively low number of edges compared to vertices.
- Dense Graph: A graph where the number of edges is close to the maximum number of edges.
- Complete Graph: A graph where every single vertex is connected to every other vertex directly.

## Graph Representation
There are several ways to represent a graph in code.
### Adjacency Matrix
It's a 2D matrix of size `V x V` where rows and columns represent vertices.
- `matrix[i][j] = 1` means there is an edge from vertex `i` to vertex `j`.
- `matrix[i][j] = 0` means there is no edge.

For an undirected graph the matrix is symmetric, so `matrix[i][j]` and `matrix[j][i]` are both set.

```cpp
vector<vector<int>> matrix = {
    {0, 1, 0},   // edge 0 -> 1
    {0, 0, 1},   // edge 1 -> 2
    {0, 0, 0}
};
```

### Adjacency List
An array of lists or a map where every vertex stores a list of its immediate neighbours.
```cpp
vector<vector<int>> adjList = {
    {1},    // Node 0 is connected to 1
    {2},    // Node 1 is connected to 2
    {}      // Node 2 is connected to nothing
};

unordered_map<string, vector<string>> adjMap;
adjMap["A"] = {"B"};
adjMap["B"] = {"C"};
adjMap["C"] = {};
```

### Edge List
A simple list of all the edges in the graph, usually represented as pairs {u, v} (and {u, v, weight} for weighted graphs).
```cpp
std::vector<std::pair<char, char>> edges = {
    {'A', 'B'},
    {'B', 'C'}
};

// For weighted edges (u, v, weight), we can use a struct or tuple:
struct Edge { int u, v, weight; };
std::vector<Edge> weightedEdges = {
    {0, 1, 10},
    {1, 2, 5}
};
```
## Graph Traversals
Graph traversal refers to starting at a vertex and going along the edges to visit the other vertices until every vertex we can reach has been visited. There are various ways to traverse a graph, and the two basic ones are BFS and DFS.

Both use the same example graph below.

```text
(0)---(1)---(3)
 |     |     |
(2)---(4)   (5)

adj[0] = {1, 2}
adj[1] = {0, 3, 4}
adj[2] = {0, 4}
adj[3] = {1, 5}
adj[4] = {1, 2}
adj[5] = {3}
```

A tree has exactly one path into every node, so you can never arrive at the same node twice. A graph can have cycles and several paths into the same vertex, so we need a `visited` array to make sure we don't traverse an already visited vertex.

### Breadth First Search
It is a graph traversal algorithm that explores vertices in order of their distance from a source. It visits every vertex at distance `k` from the source before visiting any vertex at distance `k + 1`. It maintains a queue of discovered but not yet expanded vertices and, starting with the source, repeatedly removes the oldest vertex from the queue and adds all of its not-yet-discovered neighbours until the queue is empty. It also uses a `visited` array to keep track of the visited vertices so we don't visit them again.

```cpp
void bfs(int src, const vector<vector<int>>& adj) {
    int n = adj.size();
    vector<bool> visited(n, false);
    queue<int> q;

    visited[src] = true;
    q.push(src);

    while(!q.empty()) {
        int curr = q.front();
        q.pop();

        cout << curr << ' ';

        for(int v : adj[curr]) {
            if(!visited[v]) {
                visited[v] = true;
                q.push(v);
            }
        }
    }
}
```

Running it from `0`:

```text
pop  neighbours   pushed   queue after   visited
---  -----------  -------  ------------  ------------------
 -   -            0        [0]           {0}
 0   1, 2         1, 2     [1, 2]        {0, 1, 2}
 1   0x, 3, 4     3, 4     [2, 3, 4]     {0, 1, 2, 3, 4}
 2   0x, 4x       -        [3, 4]        -
 3   1x, 5        5        [4, 5]        {0, 1, 2, 3, 4, 5}
 4   1x, 2x       -        [5]           -
 5   3x           -        []            -

order: 0 1 2 3 4 5
```

Replacing `visited` with a `dist` array gives the distances directly, and `dist[v] == -1` doubles as the "not discovered yet" marker.

```cpp
vector<int> bfsDist(int src, const vector<vector<int>>& adj) {
    vector<int> dist(adj.size(), -1);   // -1 means unreached

    queue<int> q;
    dist[src] = 0;
    q.push(src);

    while(!q.empty()) {
        int curr = q.front();
        q.pop();

        for(int v : adj[curr]) {
            if(dist[v] == -1) {
                dist[v] = dist[curr] + 1;
                q.push(v);
            }
        }
    }
    return dist;
}
```

From `0` this gives `dist = [0, 1, 1, 2, 2, 3]`. Any vertex left at `-1` is unreachable from the source.

- Time Complexity: `O(V + E)`. Every vertex is pushed and popped once, and each pop scans that vertex's adjacency list once, so every edge is looked at a constant number of times.
- Space Complexity: `O(V)` for the queue and the `visited` array

### Depth First Search
DFS follows one path as far as it will go, and only when it dead ends does it back up to the last vertex that still had an unexplored neighbour and try that instead.

```cpp
void dfs(int u, const vector<vector<int>>& adj, vector<bool>& visited) {
    visited[u] = true;
    cout << u << ' ';

    for(int v : adj[u]) {
        if(!visited[v]) {
            dfs(v, adj, visited);
        }
    }
}

int main() {
    //...
    vector<bool> visited(n, false);
    dfs(0, adj, visited);
    //...
}
```
Running it from `0`:

```text
call stack     at   neighbours   action
-------------  ---  -----------  ---------------------------------
0              0    1, 2         visit 0, recurse into 1
0 1            1    0x, 3, 4     visit 1, recurse into 3
0 1 3          3    1x, 5        visit 3, recurse into 5
0 1 3 5        5    3x           visit 5, dead end, return
0 1 3          3    -            nothing left, return
0 1            1    4            resume the loop, recurse into 4
0 1 4          4    1x, 2        visit 4, recurse into 2
0 1 4 2        2    0x, 4x       visit 2, dead end, return
                                 unwind all the way out

order: 0 1 3 5 4 2
```

If the graph is deep the recursion can overflow the stack, since around `10^5` nested frames are enough to break it on default limits. In that case we keep an explicit stack instead.

```cpp
void dfsIterative(int src, const vector<vector<int>>& adj) {
    vector<bool> visited(adj.size(), false);
    stack<int> st;
    st.push(src);

    while(!st.empty()) {
        int u = st.top();
        st.pop();

        if(visited[u]) continue;
        visited[u] = true;
        cout << u << ' ';

        for(int v : adj[u]) {
            if(!visited[v]) {
                st.push(v);
            }
        }
    }
}
```

Like BFS, one call only covers one connected component, so a disconnected graph needs the same outer loop:

```cpp
for(int i = 0; i < n; i++) {
    if(!visited[i]) dfs(i, adj, visited);
}
```

- Time Complexity: `O(V + E)`. Every vertex is entered once and each entry scans its adjacency list once, same as BFS.
- Space Complexity: `O(V)` for `visited` plus the recursion stack, whose depth is the longest path and can be `V` in the worst case.

# Leetcode Practice

## Representation and degree
- [1791. Find Center of Star Graph (Easy)](https://leetcode.com/problems/find-center-of-star-graph/description/)
- [997. Find the Town Judge (Easy)](https://leetcode.com/problems/find-the-town-judge/description/)
- [1971. Find if Path Exists in Graph (Easy)](https://leetcode.com/problems/find-if-path-exists-in-graph/description/)
- [1615. Maximal Network Rank (Medium)](https://leetcode.com/problems/maximal-network-rank/description/)

## Depth First Search
- [797. All Paths From Source to Target (Medium)](https://leetcode.com/problems/all-paths-from-source-to-target/description/)
- [841. Keys and Rooms (Medium)](https://leetcode.com/problems/keys-and-rooms/description/)
- [547. Number of Provinces (Medium)](https://leetcode.com/problems/number-of-provinces/description/)
- [323. Number of Connected Components in an Undirected Graph (Medium)](https://leetcode.com/problems/number-of-connected-components-in-an-undirected-graph/description/)
- [261. Graph Valid Tree (Medium)](https://leetcode.com/problems/graph-valid-tree/description/)
- [133. Clone Graph (Medium)](https://leetcode.com/problems/clone-graph/description/)
- [1319. Number of Operations to Make Network Connected (Medium)](https://leetcode.com/problems/number-of-operations-to-make-network-connected/description/)
- [1443. Minimum Time to Collect All Apples in a Tree (Medium)](https://leetcode.com/problems/minimum-time-to-collect-all-apples-in-a-tree/description/)
- [1466. Reorder Routes to Make All Paths Lead to the City Zero (Medium)](https://leetcode.com/problems/reorder-routes-to-make-all-paths-lead-to-the-city-zero/description/)
- [2101. Detonate the Maximum Bombs (Medium)](https://leetcode.com/problems/detonate-the-maximum-bombs/description/)
- [2359. Find Closest Node to Given Two Nodes (Medium)](https://leetcode.com/problems/find-closest-node-to-given-two-nodes/description/)

## Breadth First Search
- [1306. Jump Game III (Medium)](https://leetcode.com/problems/jump-game-iii/description/)
- [1926. Nearest Exit from Entrance in Maze (Medium)](https://leetcode.com/problems/nearest-exit-from-entrance-in-maze/description/)
- [863. All Nodes Distance K in Binary Tree (Medium)](https://leetcode.com/problems/all-nodes-distance-k-in-binary-tree/description/)
- [433. Minimum Genetic Mutation (Medium)](https://leetcode.com/problems/minimum-genetic-mutation/description/)
- [1129. Shortest Path with Alternating Colors (Medium)](https://leetcode.com/problems/shortest-path-with-alternating-colors/description/)
- [909. Snakes and Ladders (Medium)](https://leetcode.com/problems/snakes-and-ladders/description/)
- [752. Open the Lock (Medium)](https://leetcode.com/problems/open-the-lock/description/)
- [286. Walls and Gates (Medium)](https://leetcode.com/problems/walls-and-gates/description/)
- [1197. Minimum Knight Moves (Medium)](https://leetcode.com/problems/minimum-knight-moves/description/)
- [127. Word Ladder (Hard)](https://leetcode.com/problems/word-ladder/description/)
- [815. Bus Routes (Hard)](https://leetcode.com/problems/bus-routes/description/)
- [773. Sliding Puzzle (Hard)](https://leetcode.com/problems/sliding-puzzle/description/)
