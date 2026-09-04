#!/usr/bin/env python3
"""
encode a video into the 1-bit frame format read by bad-apple-life.svelte.

    ./scripts/encode-bad-apple.py bad-apple.mp4 static/bad-apple.bin --size 96

format: little-endian u16 frames, u16 rows, u16 cols, then one frame after
another, each row-major msb-first, (rows*cols/8) bytes per frame.

the grid is square and the video is stretched into it (the carousel slot is
`aspect-square`). the renderer box-downsamples this grid to whatever the
container can show at 4px per cell, so encode finer than any container needs:
96 covers a ~390px sidebar and divides cleanly by the 48 cells the 192px
desktop sidebar shows.
"""

import argparse
import gzip
import struct
import subprocess
import sys

import numpy as np

parser = argparse.ArgumentParser()
parser.add_argument("video")
parser.add_argument("out")
parser.add_argument("--size", type=int, default=96, help="cells per side")
parser.add_argument("--fps", type=int, default=30)
parser.add_argument("--threshold", type=int, default=128, help="0-255, brighter is on")
parser.add_argument("--gzip", action="store_true", help="also write <out>.gz")
args = parser.parse_args()

n = args.size
if n * n % 8:
    sys.exit(f"size {n}: {n}x{n} bits is not a whole number of bytes")

frame_bytes = n * n
proc = subprocess.run(
    [
        "ffmpeg", "-v", "error", "-i", args.video,
        "-vf", f"fps={args.fps},scale={n}:{n}:flags=area,format=gray",
        "-f", "rawvideo", "-pix_fmt", "gray", "-",
    ],
    stdout=subprocess.PIPE,
    check=True,
)

raw = np.frombuffer(proc.stdout, dtype=np.uint8)
count = raw.size // frame_bytes
if count == 0:
    sys.exit("no frames decoded")
if count > 0xFFFF:
    sys.exit(f"{count} frames overflows the u16 frame count in the header")

frames = raw[: count * frame_bytes].reshape(count, n * n)
bits = (frames > args.threshold).astype(np.uint8)
packed = np.packbits(bits, axis=1)  # msb-first, matching the reader

blob = struct.pack("<HHH", count, n, n) + packed.tobytes()
with open(args.out, "wb") as f:
    f.write(blob)

print(f"{args.out}: {n}x{n}, {count} frames, {len(blob) / 1e6:.2f} MB")

if args.gzip:
    gz = gzip.compress(blob, 9)
    with open(args.out + ".gz", "wb") as f:
        f.write(gz)
    print(f"{args.out}.gz: {len(gz) / 1e6:.2f} MB ({100 * len(gz) / len(blob):.0f}%)")
