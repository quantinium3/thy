---
title: "DSA: Recursion and the Call Stack"
description: Learning about stack frames, recursion depth limits, the recursion tree and complexity, tail calls, converting recursion to an explicit stack, and memoization with leetcode questions for practice.
author: quantinium
date: '2026-08-30'
categories:
  - data-structures-and-algorithms
  - recursion
published: false
---

# How a Function is Executed
A process gets one contiguous region of memory. The code and globals sit at the bottom, the heap grows up from there, and the stack grows *down* from the top.

```
high address
+--------------------------+
| env / argv               |
+--------------------------+
| stack   |  grows down    |  <- automatic storage, one frame per live call
|         v                |
|                          |  <- the gap. when these meet you get a stack overflow
|         ^                |
| heap    |  grows up      |  <- new / malloc, lives until freed
+--------------------------+
| bss (zero-init globals)  |
| data (init globals)      |
| text (the machine code)  |
+--------------------------+
low address
```

The stack is a Last In First Out region managed by two registers: `rsp` points at the top (the lowest used address) and `rbp` points at the base of the current frame. Every live function call owns one **stack frame** holding its arguments, its locals, and the address to jump back to when it returns.

## The call sequence
On System V AMD64 (Linux, macOS) a call is not one instruction, it is a protocol between caller and callee:

1. The caller puts the first six integer/pointer arguments in `rdi, rsi, rdx, rcx, r8, r9`, and pushes any beyond that onto the stack.
2. The caller executes `call f`, which **pushes the address of the next instruction** (the return address) and jumps to `f`.
3. The callee runs its *prologue*: save the caller's `rbp`, make `rbp` point at this frame, and subtract from `rsp` to carve out room for locals.
4. The body runs. Locals are addressed as offsets from `rbp`, e.g. `[rbp-4]`.
5. The callee runs its *epilogue*: restore `rsp`, pop `rbp`, and `ret`, which pops the return address into `rip`. The return value is left in `eax`/`rax`.

```cpp
int add(int a, int b) {
  int c = a + b;
  return c;
}

int main() {
  int r = add(2, 3);
}
```

```asm
"add(int, int)":
  push    rbp                     ; save caller's frame pointer
  mov     rbp, rsp                ; this frame starts here
  mov     DWORD PTR [rbp-20], edi ; spills the register args into from
  mov     DWORD PTR [rbp-24], esi
  mov     edx, DWORD PTR [rbp-20] ;
  mov     eax, DWORD PTR [rbp-24]
  add     eax, edx
  mov     DWORD PTR [rbp-4], eax  ; c
  mov     eax, DWORD PTR [rbp-4]  ; return value goes in eax
  pop     rbp                     ; pops return address into rip
  ret

"main":
  push    rbp                     ; prologue
  mov     rbp, rsp
  sub     rsp, 16                 ; allocating room for `r`
  mov     esi, 3                  ; argument 0
  mov     edi, 2                  ; argument 1
  call    "add(int, int)"         ; pushes return address, jumps
  mov     DWORD PTR [rbp-4], eax  ; r = returned value
  mov     eax, 0                  ; return 0
  leave
  ret
```

## Anatomy of one frame

```
--> higher address
| args 7+ (first 6 go in registers: rdi rsi rdx rcx r8 r9) |  pushed by the caller
| return address (pushed by call)                          |
| saved rbp (the frame pointer chain)                      |  <- rbp
| saved callee-saved registers (rbx, r12-r15)              |
| local variables                                          |
| padding to keep rsp 16-byte aligned                      |  <- rsp
--> lower address
```

Three consequences that matter for recursion:

- Entering a function costs a pointer subtraction, not an allocation making frames are cheap, thus making recursion viable.
- Every call gets its own copy of the locals. `n` inside `f(3)` and `n` inside `f(2)` are different memory, at different offsets down the stack. Nothing is shared unless you pass a pointer or reference, or touch the heap.
- A frame dies at `ret`. Returning a pointer or reference to a local is a dangling pointer, because the next call will reuse those bytes.

The chain of saved `rbp` values is the `call stack`; a debugger walks it to print a backtrace.

# Recursion
A recursive function is one that calls itself on a smaller version of the same problem. It needs exactly two things:

- a **base case**, an input small enough to answer without recursing
- a **recursive case**, which reduces the input and calls itself, then combines the result

```cpp
int factorial(int n) {
  if (n <= 1) return 1;          // base case
  return n * factorial(n - 1);   // recursive case
}
```

## The leap of faith
Do not trace it in your head. Trust that `factorial(n - 1)` returns the right answer and only verify three things:

1. The contract: what does this function return for a given input? Write it down in one sentence.
2. The base case answers the smallest input correctly.
3. Every recursive call moves strictly closer to the base case.

If all three hold, induction does the rest. Tracing a recursion by hand beyond two levels is a waste of interview time.

## What the stack looks like
`factorial(3)` is four frames at its peak, not one:

```
call factorial(3)                    | factorial(1)  n=1 | <- top, returns first
  call factorial(2)                  | factorial(2)  n=2 |
    call factorial(1) -> 1           | factorial(3)  n=3 |
  2 * 1 = 2, returns 2               | main              |
3 * 2 = 6, returns 6                 +-------------------+
```

Every recursion has two phases, and where you put your work decides which one you are in:

```cpp
void f(Node *node) {
  if (!node) return;
  visit(node);        // winding phase: work on the way DOWN, pre-order
  f(node->next);
  visit(node);        // unwinding phase: work on the way BACK UP, post-order
}
```

The unwinding phase is the part people forget exists. It is what lets you reverse a linked list recursively, or compute a subtree's height before using it in the parent.

# Recursion Depth and Stack Overflow
The stack is a fixed-size region. On Linux the main thread gets 8 MB by default (`ulimit -s`), Windows gives 1 MB, and spawned threads usually get less. Overrun it and the program dies with a segfault, not an exception you can catch.

A small frame is 32 to 64 bytes, so 8 MB is roughly 150k to 250k frames. Working numbers for interviews:

| depth | verdict |
| --- | --- |
| up to 10^4 | always fine |
| 10^5 | borderline, fine for small frames, dead if the frame holds a `vector` or `string` |
| 10^6+ | guaranteed overflow |


Two more things blow the stack faster than the frame count suggests:

```cpp
// O(n) copy per call, O(n * depth) memory
void bad(vector<int> path, string s);

// pass by const reference, index into the original
void good(const vector<int> &path, const string &s, int i);
```

# The Recursion Tree and Complexity
Draw the calls as a tree, one node per invocation. Then:

- **Time** = (number of nodes) x (work per node, *excluding* the recursive calls)
- **Space** = (maximum depth) x (frame size), plus any heap you keep alive

That is the whole method. The two shapes worth memorising:

```
linear recursion              branching recursion
T(n) = T(n-1) + O(1)          T(n) = 2T(n-1) + O(1)

f(4)                          f(3)
 |                           /    \
f(3)                       f(2)    f(2)
 |                        /   \    /   \
f(2)                    f(1) f(1) f(1) f(1)
 |
f(1)                    2^n - 1 nodes -> O(2^n) time
                        depth n        -> O(n) space
n nodes -> O(n) time
depth n -> O(n) space
```

A branching recursion with branching factor `b` and depth `d` has `O(b^d)` nodes. Note that time and space are wildly different here: exponential time, linear space, because only one root-to-leaf path is on the stack at any moment.

## Divide and conquer: the master theorem
For `T(n) = a * T(n/b) + O(n^d)`, compare `d` against `log_b(a)`:

- `d > log_b(a)` -> `O(n^d)`, the root dominates
- `d = log_b(a)` -> `O(n^d log n)`, every level costs the same
- `d < log_b(a)` -> `O(n^(log_b a))`, the leaves dominate

```
binary search   T(n) = T(n/2) + O(1)     -> O(log n) time, O(log n) stack
merge sort      T(n) = 2T(n/2) + O(n)    -> O(n log n) time, O(n) buffer + O(log n) stack
naive fib       T(n) = T(n-1) + T(n-2)   -> O(phi^n) ~ O(1.618^n) time, O(n) stack
subsets         2 branches, depth n      -> O(n * 2^n)
permutations    n branches, depth n      -> O(n * n!)
```

The `O(n)` stack on naive fib rather than `O(2^n)` is the point people miss in interviews: the tree is exponentially wide but only `n` deep, and the stack only ever holds one path.

# Tail Calls
A call is in **tail position** if its result is returned directly, with no pending work in the caller's frame.

```cpp
int fact(int n) {
  return n * fact(n - 1);           // NOT a tail call, the multiply is still pending
}

int fact(int n, int acc = 1) {
  if (n <= 1) return acc;
  return fact(n - 1, acc * n);      // tail call, nothing left to do after it returns
}
```

When nothing is pending, the current frame is dead the moment the call is made, so a compiler can reuse it instead of pushing a new one. That turns the recursion into a jump, i.e. a loop, with `O(1)` stack. GCC and Clang do this at `-O2`, but the C++ standard does not require it and a debug build will not do it. Java, Python and most JS engines never do it.

```cpp
int fact(int n) {
  int acc = 1;
  while (n > 1) { acc *= n; n -= 1; }
  return acc;
}
```

# Converting Recursion to an Explicit Stack
Any recursion can become a loop plus an explicit stack, because that is exactly what the machine was doing for you. The frame held three things, so your stack entry holds the same three: **the arguments, the locals you still need, and where to resume**.

Easy case first, one recursive call in tail position becomes a plain loop with no stack at all. The interesting case is a single non-tail call, which needs the stack but not a resume point:

```cpp
// recursive
void inorder(TreeNode *root, vector<int> &out) {
  if (!root) return;
  inorder(root->left, out);
  out.push_back(root->val);
  inorder(root->right, out);
}

// explicit stack: walk left pushing, then pop, visit, and turn right
vector<int> inorder(TreeNode *root) {
  vector<int> out;
  stack<TreeNode *> st;
  TreeNode *cur = root;
  while (cur || !st.empty()) {
    while (cur) { st.push(cur); cur = cur->left; }
    cur = st.top(); st.pop();
    out.push_back(cur->val);
    cur = cur->right;
  }
  return out;
}
```

When there are two or more calls and work after each of them, you need the resume point explicitly. This is the general recipe, and it works for anything:

```cpp
// postorder: left, right, then visit. each frame has three stages.
vector<int> postorder(TreeNode *root) {
  vector<int> out;
  stack<pair<TreeNode *, int>> st;   // {node, stage}
  if (root) st.push({root, 0});
  while (!st.empty()) {
    auto &[node, stage] = st.top();
    if (stage == 0) { stage = 1; if (node->left)  st.push({node->left, 0});  }
    else if (stage == 1) { stage = 2; if (node->right) st.push({node->right, 0}); }
    else { out.push_back(node->val); st.pop(); }
  }
  return out;
}
```

The `stage` field *is* the return address. Once you see that, the equivalence between recursion and an explicit stack stops being a trick and becomes a translation.

# Memoization
Branching recursion is exponential because it recomputes the same subproblem along different paths. `fib(5)` calls `fib(3)` twice, `fib(2)` three times:

```
                fib(5)
           /            \
       fib(4)           fib(3)      <- fib(3) computed twice
      /     \          /     \
   fib(3)  fib(2)   fib(2)  fib(1)  <- fib(2) three times
```

If the answer depends only on the arguments, cache it. This is **overlapping subproblems**, and caching turns the tree into a DAG:

```cpp
int fib(int n, vector<int> &memo) {
  if (n <= 1) return n;
  if (memo[n] != -1) return memo[n];      // already solved
  return memo[n] = fib(n - 1, memo) + fib(n - 2, memo);
}
```

`O(2^n)` becomes `O(n)`, because after memoizing the counting rule changes:

**time = (number of distinct states) x (work per state)**

That is the same formula as the recursion tree, with "nodes" replaced by "distinct nodes". It is also the entire cost model of top-down DP.

Three rules that decide whether the cache is correct:

- **Key on the complete varying state.** If the answer depends on `(i, remaining)` and you key on `i` alone, you will return a cached answer computed under a different `remaining` and be silently wrong.
- **Keep the state small.** State that includes a whole vector or path is not memoizable in any useful way; find the summary that actually matters (an index, a count, a bitmask).
- **Pick a sentinel outside the answer range.** `-1` for "not computed" breaks the moment `-1` is a legal answer. Use a separate `visited` array when in doubt.

Space is now `O(states)` for the table plus `O(depth)` for the stack. Converting to bottom-up iteration removes the stack term and the recursion depth risk with it.


## Complexity
- Time Complexity: (number of nodes in the recursion tree) x (work per node); with memoization, (distinct states) x (work per state)
- Space Complexity
  - Stack: O(maximum recursion depth), independent of the tree's width
  - Extra: O(states) for a memo table, plus anything allocated per frame

# Leetcode Practice

## The leap of faith
- [206. Reverse Linked List (Easy)](https://leetcode.com/problems/reverse-linked-list/description/) — write it recursively first, then iteratively
- [21. Merge Two Sorted Lists (Easy)](https://leetcode.com/problems/merge-two-sorted-lists/description/) — clean combine step
- [344. Reverse String (Easy)](https://leetcode.com/problems/reverse-string/description/) — in place, two pointers as recursion
- [24. Swap Nodes in Pairs (Medium)](https://leetcode.com/problems/swap-nodes-in-pairs/description/)
- [779. K-th Symbol in Grammar (Medium)](https://leetcode.com/problems/k-th-symbol-in-grammar/description/) — recurse on the index, never build the string

## Divide and conquer
- [50. Pow(x, n) (Medium)](https://leetcode.com/problems/powx-n/description/) — fast exponentiation, watch negative n and INT_MIN
- [912. Sort an Array (Medium)](https://leetcode.com/problems/sort-an-array/description/) — implement merge sort, then compare stack depth with quicksort
- [148. Sort List (Medium)](https://leetcode.com/problems/sort-list/description/) — merge sort where O(1) space forces bottom-up
- [241. Different Ways to Add Parentheses (Medium)](https://leetcode.com/problems/different-ways-to-add-parentheses/description/)
- [23. Merge k Sorted Lists (Hard)](https://leetcode.com/problems/merge-k-sorted-lists/description/) — pairwise merge is the divide and conquer version

## Tree recursion (warm-up for A16)
- [104. Maximum Depth of Binary Tree (Easy)](https://leetcode.com/problems/maximum-depth-of-binary-tree/description/)
- [226. Invert Binary Tree (Easy)](https://leetcode.com/problems/invert-binary-tree/description/)
- [110. Balanced Binary Tree (Easy)](https://leetcode.com/problems/balanced-binary-tree/description/) — return height and validity in one pass
- [543. Diameter of Binary Tree (Easy)](https://leetcode.com/problems/diameter-of-binary-tree/description/) — return one value, track another
- [124. Binary Tree Maximum Path Sum (Hard)](https://leetcode.com/problems/binary-tree-maximum-path-sum/description/) — same pattern, harder combine

## Recursion to explicit stack
- [94. Binary Tree Inorder Traversal (Easy)](https://leetcode.com/problems/binary-tree-inorder-traversal/description/) — both ways
- [145. Binary Tree Postorder Traversal (Easy)](https://leetcode.com/problems/binary-tree-postorder-traversal/description/) — needs an explicit stage per frame
- [394. Decode String (Medium)](https://leetcode.com/problems/decode-string/description/) — recursive descent vs a stack
- [341. Flatten Nested List Iterator (Medium)](https://leetcode.com/problems/flatten-nested-list-iterator/description/) — the stack is the whole answer
- [224. Basic Calculator (Hard)](https://leetcode.com/problems/basic-calculator/description/) — recursive descent parsing

## Memoization (preview of A26)
- [509. Fibonacci Number (Easy)](https://leetcode.com/problems/fibonacci-number/description/) — time it without the cache first
- [70. Climbing Stairs (Easy)](https://leetcode.com/problems/climbing-stairs/description/)
- [139. Word Break (Medium)](https://leetcode.com/problems/word-break/description/)
- [322. Coin Change (Medium)](https://leetcode.com/problems/coin-change/description/) — top down, then convert to bottom up
