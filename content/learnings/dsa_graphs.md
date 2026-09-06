---
title: "DSA: Graphs"
description: Learning about heaps
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
(A) --- (B)
 |     /
 |    /
(C)---(D)
```
Here, A, B, C, D are vertices, and the lines are edges.

Real-life examples:
- Social network → people are nodes, friendships are edges
- Google Maps → cities are nodes, roads are edges
- Internet → routers are nodes, cables are edges

## Types of Graphs
- Undirected Graphs: The relationship between vertices is two way and has no direction.
- Directed Graphs: The relationship between vertices is one way and has a direction. Eg: followers on twitters.
- Unweighted Graphs: All edges are treated equally and we only care for connection
- Weighted Grapsh: Each edge has a value or cost associated with it. Eg: In google maps, weights could be the distance or time between cities.
- Cyclic Graphs: The graph contains at least one cycles (a path that starts and end at the same vertex).
- Acyclic Graphs: The graph contains no cycles.
  - Tree: An undirected graph with no cycles.
  - DAG (Direct acyclic graph): A directed graph with no cycle.

## Terminologies
- Degree (Undirected Graphs): The degree of a vertex is the number of edges connected to it. If a vertex has degree `0` then its an isolated vertex and a vertex with a degree `1` is a leaf node.
- In-Degree (Directed Graphs): The number of edges coming into a vertex.
- Out-Degree (Directed Graphs): The number of edges coming out of a vertex.
- Path: A sequence of edges that connected a sequence of vertices.
- Connected Graph: An undirected graph where there is a valid path between every pair of vertices. No node or group of nodes is cut off from the rest.
- Strongly Connected: A directed graph where there is a path from every node to every other node in both directions.
- Weekly Connected: A directed graph that would be connected if we ignored the direction of the edges.
- Sparse Graph: A graph with relatively low number of edges compared to vertices.
- Dense Graph: A graph where the number of edges is close to the maximum number of graphs.
- Complete Graph: A graph where every single vertex is connected to every other vertex directly.

## Graph Representation
There are different way to represent graphs in code such as
### Adjacency Matrix
It's a 2d matrix of size `V x V` where rows and columns represent vertices.
- `matrix[i][j] = 1` means there an edge between vertex `i` and `j`.
- `matrix[i][j] = 0` means there is no edge.

```cpp
vector<vector<int> matrix = {
  [0, 1, 0],
  [0, 0, 1],
  [0, 0, 0]
};
```

### Adjacency List
An array of lists of map where every vertex stores a list of its immediate neighbours.
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
A simple list of all the edges in the graph, usually represented as pairs {u, v} (and {u, v, weight} for weighted graphs)
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
