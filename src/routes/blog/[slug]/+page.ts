import { error } from '@sveltejs/kit';

export async function load({ params }: { params: { slug: string } }) {
	try {
		const post = await import(`../../../../content/blog/${params.slug}.md`);
		return {
			content: post.default,
			title: post.metadata?.title ?? 'untitled',
			date: post.metadata?.date ?? '',
			description: post.metadata?.description ?? '',
			tags: post.metadata?.tags ?? []
		};
	} catch {
		error(404, 'post not found');
	}
}
