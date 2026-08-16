import { loadPosts } from '$lib/posts';

export async function load() {
	return {
		posts: loadPosts('blog', { limit: 5 }),
		learnings: loadPosts('learnings', { limit: 5 })
	};
}
