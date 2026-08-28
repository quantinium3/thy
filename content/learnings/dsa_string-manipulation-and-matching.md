---
title: "DSA: String Manipulation and Matching"
description: Learning about the cost model of strings, frequency vectors as window state, bytes vs characters, and rolling hashes for O(1) substring comparison with leetcode questions for practice.
author: quantinium
date: '2026-08-29'
categories:
  - data-structures-and-algorithms
  - strings
published: true
---

# Strings
A string looks like an array of characters, and most of the techniques already covered i.e. two pointers, sliding window, hashing apply to it unchanged.

# The Cost Model
An `int[]` tells the truth about what an operation costs. A string does not, because the language hides allocation behind `+` and `substr`.

## Concatenation in a loop is quadratic
```cpp
// O(n^2) - `out + p` builds a whole new string every iteration
string join(const vector<string> &parts) {
  string out;
  for (const auto &p : parts) out = out + p;
  return out;
}

// O(n) - `+=` grows the same buffer, geometrically
string join(const vector<string> &parts) {
  size_t total = 0;
  for (const auto &p : parts) total += p.size();

  string out;
  out.reserve(total);
  for (const auto &p : parts) out += p;
  return out;
}
```

## substr copies, it does not view
```cpp
// O(n*m) with an allocation per iteration
for (int i = 0; i + m <= n; i++)
  if (s.substr(i, m) == pattern) found(i);

// O(n*m) with zero allocations
for (int i = 0; i + m <= n; i++)
  if (s.compare(i, m, pattern) == 0) found(i);
```

# Rolling Hash
The one matching tool worth learning at this stage, because it is short and it turns "are these two substrings equal" into an O(1) question after O(n) preprocessing.

Treat the string as a number in base `B`: `h[i+1] = h[i] * B + s[i]`, all modulo a large prime. Then the hash of any substring falls out of a prefix subtraction, exactly like a prefix sum.

```cpp
struct SubstrHash {
  static const unsigned long long M = (1ULL << 61) - 1;
  vector<unsigned long long> h, p;
  unsigned long long B;

  // multiply mod 2^61 - 1 without overflowing
  static unsigned long long mul(unsigned long long a, unsigned long long b) {
    __uint128_t c = (__uint128_t)a * b;
    unsigned long long lo = (unsigned long long)(c & M);
    unsigned long long hi = (unsigned long long)(c >> 61);
    lo += hi;
    return lo >= M ? lo - M : lo;
  }

  SubstrHash(const string &s, unsigned long long base) : B(base) {
    int n = s.size();
    h.assign(n + 1, 0);
    p.assign(n + 1, 1);
    for (int i = 0; i < n; i++) {
      h[i + 1] = (mul(h[i], B) + (unsigned char)s[i]) % M;
      p[i + 1] = mul(p[i], B);
    }
  }

  // hash of s[l..r], inclusive
  unsigned long long get(int l, int r) const {
    return (h[r + 1] + M - mul(h[l], p[r - l + 1])) % M;
  }
};

mt19937_64 rng(chrono::steady_clock::now().time_since_epoch().count());
unsigned long long base = rng() % (SubstrHash::M - 300) + 256;
```

## Tradeoffs
Equal hashes do not prove equal strings, they make it overwhelmingly likely. For `q` compared pairs and modulus `M` the birthday bound puts the collision chance at roughly `q^2 / 2M`. With `M = 2^61 - 1` and a million comparisons that is about `10^-7`. With `M = 1e9 + 7` it is closer to a coin flip, which is why the textbook `base = 31, mod = 1e9 + 7` is not good enough at scale.

Two more rules: map characters to values >= 1, otherwise `"a"`, `"aa"` and `"aaa"` all hash to the same thing, and pick the base at runtime rather than compile time, since a fixed base can be defeated by adversarial input.

## Complexity
- Time Complexity
  - Preprocessing: O(n)
  - Substring hash: O(1)
  - Substring equality: O(1) probabilistic, O(n) if you verify the match
- Space Complexity: O(n)

# Leetcode Practice

## Cost model and building
- [443. String Compression (Medium)](https://leetcode.com/problems/string-compression/description/) — in-place, no extra buffer
- [38. Count and Say (Medium)](https://leetcode.com/problems/count-and-say/description/)
- [271. Encode and Decode Strings (Medium)](https://leetcode.com/problems/encode-and-decode-strings/description/) — length prefixing, the reason protocols do it
- [68. Text Justification (Hard)](https://leetcode.com/problems/text-justification/description/)

## Two pointers on strings
- [125. Valid Palindrome (Easy)](https://leetcode.com/problems/valid-palindrome/description/)
- [680. Valid Palindrome II (Easy)](https://leetcode.com/problems/valid-palindrome-ii/description/)
- [151. Reverse Words in a String (Medium)](https://leetcode.com/problems/reverse-words-in-a-string/description/) — do it in place, reverse-all then reverse-each
- [5. Longest Palindromic Substring (Medium)](https://leetcode.com/problems/longest-palindromic-substring/description/) — expand around centre, O(n^2)

## Canonical form
- [242. Valid Anagram (Easy)](https://leetcode.com/problems/valid-anagram/description/) — follow up: what if the input is Unicode
- [205. Isomorphic Strings (Easy)](https://leetcode.com/problems/isomorphic-strings/description/) — the mapping must be checked both ways
- [290. Word Pattern (Easy)](https://leetcode.com/problems/word-pattern/description/)
- [567. Permutation in String (Medium)](https://leetcode.com/problems/permutation-in-string/description/) — the nonzero-counter version above

## Parsing and simulation
- [8. String to Integer, atoi (Medium)](https://leetcode.com/problems/string-to-integer-atoi/description/) — overflow before it happens, not after
- [165. Compare Version Numbers (Medium)](https://leetcode.com/problems/compare-version-numbers/description/)
- [6. Zigzag Conversion (Medium)](https://leetcode.com/problems/zigzag-conversion/description/)
- [13. Roman to Integer (Easy)](https://leetcode.com/problems/roman-to-integer/description/)

## Rolling hash
- [28. Find the Index of the First Occurrence in a String (Easy)](https://leetcode.com/problems/find-the-index-of-the-first-occurrence-in-a-string/description/) — Rabin-Karp here, KMP later
- [1044. Longest Duplicate Substring (Hard)](https://leetcode.com/problems/longest-duplicate-substring/description/) — binary search the length, hash each window
- [214. Shortest Palindrome (Hard)](https://leetcode.com/problems/shortest-palindrome/description/) — longest palindromic prefix, forward hash vs reverse hash
