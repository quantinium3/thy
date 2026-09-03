import { loadPosts } from '$lib/posts';

export async function load() {
	return { learnings: loadPosts('learnings', { readingTime: true }) };
}
