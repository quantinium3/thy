import { loadPosts } from '$lib/posts';

export async function load() {
	return { misc: loadPosts('misc', { readingTime: true }) };
}
