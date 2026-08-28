---
title: "DSA: Matrix Traversal"
description: Learning about row major layout and cache behaviour, flat indexing, direction arrays, spiral and diagonal orders, in-place rotation, using the matrix as its own scratch space, staircase search, and treating a grid as a graph with leetcode questions for practice.
author: quantinium
date: '2026-08-31'
categories:
  - data-structures-and-algorithms
  - matrix
published: false
---

# Matrices
A matrix is not a new data structure, it is an array with an index convention. Everything already covered i.e. two pointers, binary search, prefix sums, hashing, recursion applies to it unchanged, once you are honest about what `a[r][c]` compiles to.

```cpp
int a[3][4];                                // ONE contiguous block of 12 ints
vector<vector<int>> b(3, vector<int>(4));   // a vector of 3 pointers to 3 separate heap blocks
vector<int> c(3 * 4);                       // one block again, you do the index math
```

For the true 2D array, `a[r][c]` is `*(base + r * cols + c)`. Rows are laid out one after another, which is **row major** order. C, C++, Python and Rust are row major; Fortran, MATLAB and R are column major.

## Flat indexing
```cpp
idx = r * cols + c;
r   = idx / cols;
c   = idx % cols;
```

- binary searching a fully sorted matrix as if it were one array of length `n * m`
- encoding a cell as a single `int` key for a hash set, a `visited` bitset, or a queue
- flattening `vector<vector<int>>` into one `vector<int>` when allocation or locality matters

The other index trick that shows up constantly is the sub-box, e.g. the 3x3 box of a sudoku cell:

```cpp
box = (r / 3) * 3 + (c / 3);   // 0..8
```

## The cost model
Both loop orders are `O(n * m)`, and they are not the same program:

```cpp
for (int r = 0; r < n; r++)
  for (int c = 0; c < m; c++) sum += a[r][c];   // sequential, one cache line feeds ~16 ints

for (int c = 0; c < m; c++)
  for (int r = 0; r < n; r++) sum += a[r][c];   // strided by m * 4 bytes, a cache miss per step
```

On a large matrix the column major version runs several times slower for identical asymptotics. `vector<vector<int>>` is worse still, because the rows are separately allocated and scattered, so even the "fast" order chases pointers. Keep the inner loop on the last index, and if you are writing something performance sensitive rather than an interview answer, use a flat `vector<int>`.

# Bounds
```cpp
bool inside(int r, int c, int n, int m) {
  return r >= 0 && r < n && c >= 0 && c < m;
}
```

# Neighbours
```cpp
const int dr[4] = {-1, 1, 0, 0};
const int dc[4] = {0, 0, -1, 1};

for (int k = 0; k < 4; k++) {
  int nr = r + dr[k], nc = c + dc[k];
  if (!inside(nr, nc, n, m)) continue;
  // ...
}
```

Two variants worth knowing. The rotating pair, which is the same thing in one array:

```cpp
const int d[5] = {-1, 0, 1, 0, -1};   // (d[k], d[k+1]) for k = 0..3
```

And all eight neighbours, where the double loop beats writing out sixteen constants:

```cpp
for (int i = -1; i <= 1; i++)
  for (int j = -1; j <= 1; j++) {
    if (i == 0 && j == 0) continue;   // skip the cell itself
    // ...
  }
```

# Traversal Orders
## Boundary and layers
A matrix peels like an onion. Layer `k` is the ring with `top = k`, `bot = n-1-k`, `left = k`, `right = m-1-k`, and there are `ceil(min(n, m) / 2)` of them. Both the spiral and the in-place rotation are layer algorithms.

## Spiral
Four walls that close in. The whole difficulty is in two guards:

```cpp
vector<int> spiralOrder(vector<vector<int>> &a) {
  if (a.empty()) return {};
  int top = 0, bot = a.size() - 1, left = 0, right = a[0].size() - 1;
  vector<int> out;
  while (top <= bot && left <= right) {
    for (int c = left; c <= right; c++) out.push_back(a[top][c]);
    top++;
    for (int r = top; r <= bot; r++) out.push_back(a[r][right]);
    right--;
    if (top <= bot) {                                  // else a single leftover row
      for (int c = right; c >= left; c--) out.push_back(a[bot][c]);
      bot--;
    }
    if (left <= right) {                               // else a single leftover column
      for (int r = bot; r >= top; r--) out.push_back(a[r][left]);
      left++;
    }
  }
  return out;
}
```

Without those two `if`s, a matrix that ends on one remaining row or column emits it twice, going right and then coming back left. Every wrong spiral submission is that bug.

## Diagonals
Two constants describe every diagonal, and both are one line of arithmetic:

```
r + c is constant along an anti-diagonal (top-right to bottom-left)
r - c is constant along a main diagonal  (top-left to bottom-right)
```

```
r + c                      r - c
0  1  2  3                 0  -1 -2 -3
1  2  3  4                 1   0 -1 -2
2  3  4  5                 2   1  0 -1

n + m - 1 anti-diagonals   n + m - 1 diagonals, shift by + m - 1 to index from 0
```

So bucketing a matrix by diagonal is a single pass with no geometry:

```cpp
vector<vector<int>> byAntiDiagonal(vector<vector<int>> &a) {
  int n = a.size(), m = a[0].size();
  vector<vector<int>> d(n + m - 1);
  for (int r = 0; r < n; r++)
    for (int c = 0; c < m; c++) d[r + c].push_back(a[r][c]);
  return d;                       // reverse the odd (or even) buckets for a zigzag
}
```

`r - c` is why the N-Queens diagonal check is `O(1)`: keep a set of used `r + c` and used `r - c + n - 1`, never scan.

# In-place Transformations
Rotation is not its own algorithm, it is a composition of two cheap involutions:

```
rotate 90 clockwise      = transpose, then reverse each row
rotate 90 anticlockwise  = transpose, then reverse each column
rotate 180               = reverse each row, then reverse each column
```

```cpp
void rotate(vector<vector<int>> &a) {
  int n = a.size();
  for (int r = 0; r < n; r++)
    for (int c = r + 1; c < n; c++)     // strictly upper triangle
      swap(a[r][c], a[c][r]);
  for (auto &row : a) reverse(row.begin(), row.end());
}
```

`c = r + 1` is the detail people lose marks on. Looping the full square swaps every pair twice, which is the identity, and the matrix comes back unchanged.

Note that transposing in place only works on a **square** matrix. A non-square transpose changes the shape, so it needs a second buffer, and the flat in-place version is a permutation-cycle algorithm well outside interview scope.

# The Matrix as Its Own Scratch Space
When a problem says `O(1)` extra space, the matrix itself is the storage. Two patterns cover almost all of it.

**Use row 0 and column 0 as the marker arrays.** The catch is that `a[0][0]` would have to mean two things, so one of the two gets a separate flag:

```cpp
void setZeroes(vector<vector<int>> &a) {
  int n = a.size(), m = a[0].size();
  bool col0 = false;

  for (int r = 0; r < n; r++) {
    if (a[r][0] == 0) col0 = true;              // column 0 needs its own flag
    for (int c = 1; c < m; c++)
      if (a[r][c] == 0) { a[r][0] = 0; a[0][c] = 0; }
  }

  for (int r = n - 1; r >= 0; r--) {            // bottom-up, so the markers are read before overwritten
    for (int c = m - 1; c >= 1; c--)
      if (a[r][0] == 0 || a[0][c] == 0) a[r][c] = 0;
    if (col0) a[r][0] = 0;
  }
}
```

The reverse iteration is not a style choice. Going top-down would zero row 0 early and destroy the markers the later rows still need to read.

**Pack the next state into spare bits of the current one**, when a simultaneous update would otherwise need a copy:

```cpp
// game of life: bit 0 is now, bit 1 is next
a[r][c] |= (next << 1);
// second pass
a[r][c] >>= 1;
```

Both are the same idea, encode the answer somewhere the input is not looking yet.

# Searching a Matrix
"Sorted matrix" means two different things, with two different algorithms.

**Fully sorted in row major order** (each row sorted, and every row starts above the previous row's end). It is a sorted array wearing a costume, so binary search the flat index:

```cpp
bool searchMatrix(vector<vector<int>> &a, int target) {
  int n = a.size(), m = a[0].size();
  int lo = 0, hi = n * m - 1;
  while (lo <= hi) {
    int mid = lo + (hi - lo) / 2;
    int v = a[mid / m][mid % m];
    if (v == target) return true;
    if (v < target) lo = mid + 1;
    else hi = mid - 1;
  }
  return false;
}
```

`O(log(n * m))`.

**Rows sorted and columns sorted, independently.** There is no global order, so binary search has nothing to halve. Start at the top-right corner instead:

```cpp
bool searchMatrix(vector<vector<int>> &a, int target) {
  int r = 0, c = (int)a[0].size() - 1;
  while (r < (int)a.size() && c >= 0) {
    if (a[r][c] == target) return true;
    if (a[r][c] > target) c--;    // everything below in this column is even bigger, drop the column
    else r++;                     // everything left in this row is even smaller, drop the row
  }
  return false;
}
```

`O(n + m)`, and each step deletes an entire row or column, which is why it terminates. Top-right and bottom-left are the only two corners that work, because they are the only ones where the two moves change the value in opposite directions. From the top-left, both moves increase.

# The Grid as a Graph
A grid is a graph you never have to build: the node is a cell, and the adjacency list is `dr/dc` computed on demand. So DFS, BFS and shortest path all apply directly, with `V = n * m` and `E = 4 * n * m`, i.e. everything is `O(n * m)`.

```cpp
void dfs(vector<vector<char>> &g, int r, int c) {
  if (!inside(r, c, g.size(), g[0].size()) || g[r][c] != '1') return;
  g[r][c] = '0';                              // mark by mutating, no visited array needed
  for (int k = 0; k < 4; k++) dfs(g, r + dr[k], c + dc[k]);
}
```

Marking the cell *before* recursing is what prevents infinite mutual recursion between two adjacent cells. If the grid must be preserved, use a separate `visited` array and accept the extra `O(n * m)` space.

## Complexity
- Full traversal, spiral, diagonal: O(n * m) time, O(1) extra space
- Transpose / rotate in place: O(n^2) time, O(1) extra space
- Search, fully sorted: O(log(n * m)) time, O(1) space
- Search, row and column sorted: O(n + m) time, O(1) space
- DFS / BFS over the grid: O(n * m) time, O(n * m) worst case for the stack or the queue

# Leetcode Practice

## Traversal orders
- [867. Transpose Matrix (Easy)](https://leetcode.com/problems/transpose-matrix/description/) — note it is not in place when the matrix is not square
- [766. Toeplitz Matrix (Easy)](https://leetcode.com/problems/toeplitz-matrix/description/) — `r - c` is the whole solution
- [54. Spiral Matrix (Medium)](https://leetcode.com/problems/spiral-matrix/description/) — the two guards
- [59. Spiral Matrix II (Medium)](https://leetcode.com/problems/spiral-matrix-ii/description/) — same walls, writing instead of reading
- [498. Diagonal Traverse (Medium)](https://leetcode.com/problems/diagonal-traverse/description/) — bucket by `r + c`, reverse alternate buckets
- [1424. Diagonal Traverse II (Medium)](https://leetcode.com/problems/diagonal-traverse-ii/description/) — ragged rows, where `r + c` bucketing beats simulating the walk
- [885. Spiral Matrix III (Hard)](https://leetcode.com/problems/spiral-matrix-iii/description/) — spiral with growing leg lengths, off the grid and back

## In-place transformation
- [832. Flipping an Image (Easy)](https://leetcode.com/problems/flipping-an-image/description/) — reverse and invert in one pass
- [48. Rotate Image (Medium)](https://leetcode.com/problems/rotate-image/description/) — transpose then reverse, watch the `c = r + 1`
- [73. Set Matrix Zeroes (Medium)](https://leetcode.com/problems/set-matrix-zeroes/description/) — O(1) space with the first row and column as markers
- [289. Game of Life (Medium)](https://leetcode.com/problems/game-of-life/description/) — two states per cell, follow up is the infinite board
- [1861. Rotating the Box (Medium)](https://leetcode.com/problems/rotating-the-box/description/) — gravity as a two pointer per row, then rotate

## Search
- [74. Search a 2D Matrix (Medium)](https://leetcode.com/problems/search-a-2d-matrix/description/) — flat index binary search
- [240. Search a 2D Matrix II (Medium)](https://leetcode.com/problems/search-a-2d-matrix-ii/description/) — staircase from the top-right
- [1428. Leftmost Column with at Least a One (Medium)](https://leetcode.com/problems/leftmost-column-with-at-least-a-one/description/) — staircase behind an API with a query budget
- [378. Kth Smallest Element in a Sorted Matrix (Medium)](https://leetcode.com/problems/kth-smallest-element-in-a-sorted-matrix/description/) — binary search on the answer, count with the staircase
- [1351. Count Negative Numbers in a Sorted Matrix (Easy)](https://leetcode.com/problems/count-negative-numbers-in-a-sorted-matrix/description/) — the staircase used to count instead of to find

## Grid as a graph
- [733. Flood Fill (Easy)](https://leetcode.com/problems/flood-fill/description/) — the base case
- [200. Number of Islands (Medium)](https://leetcode.com/problems/number-of-islands/description/) — connected components, then redo it with BFS and compare depth
- [695. Max Area of Island (Medium)](https://leetcode.com/problems/max-area-of-island/description/) — DFS that returns a value
- [130. Surrounded Regions (Medium)](https://leetcode.com/problems/surrounded-regions/description/) — start from the border, invert the question
- [994. Rotting Oranges (Medium)](https://leetcode.com/problems/rotting-oranges/description/) — multi-source BFS, level by level
- [542. 01 Matrix (Medium)](https://leetcode.com/problems/01-matrix/description/) — multi-source BFS, the reason not to BFS from every cell
- [1091. Shortest Path in Binary Matrix (Medium)](https://leetcode.com/problems/shortest-path-in-binary-matrix/description/) — 8 directions
- [417. Pacific Atlantic Water Flow (Medium)](https://leetcode.com/problems/pacific-atlantic-water-flow/description/) — reverse the flow, DFS from both oceans

## Simulation and grid DP
- [36. Valid Sudoku (Medium)](https://leetcode.com/problems/valid-sudoku/description/) — the `(r / 3) * 3 + c / 3` box index
- [79. Word Search (Medium)](https://leetcode.com/problems/word-search/description/) — backtracking on a grid, restore the cell on the way out
- [51. N-Queens (Hard)](https://leetcode.com/problems/n-queens/description/) — `r + c` and `r - c` as O(1) diagonal checks
- [221. Maximal Square (Medium)](https://leetcode.com/problems/maximal-square/description/) — DP where the state is the cell
- [85. Maximal Rectangle (Hard)](https://leetcode.com/problems/maximal-rectangle/description/) — a histogram per row
