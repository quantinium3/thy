import { error } from '@sveltejs/kit';
import { loadPosts } from '$lib/posts';
import { getPin } from '$lib/server/pins';

export function load({ params }) {
	const pin = getPin(params.pin);
	if (!pin) error(404, 'Not found');

	return {
		pin,
		posts: loadPosts('blog', { limit: 5 }),
		learnings: loadPosts('learnings', { limit: 5 })
	};
}
