import { loadPosts } from '$lib/posts';

export async function load() {
	return { posts: loadPosts('blog', { readingTime: true }) };
}
