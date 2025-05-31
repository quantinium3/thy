import type { Blog } from "$lib/types"

export async function load({ fetch }) {
    const res = await fetch('/api/blog');
    const blogs: Blog[] = await res.json();
    return { blogs };
}
