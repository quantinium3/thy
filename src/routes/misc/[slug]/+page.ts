import { error } from '@sveltejs/kit';

export async function load({ params }: { params: { slug: string } }) {
	try {
		const post = await import(`../../../../content/misc/${params.slug}.md`);
		return {
			content: post.default,
			title: post.metadata?.title ?? 'untitled',
			date: post.metadata?.date ?? '',
			description: post.metadata?.description ?? '',
			tags: post.metadata?.tags ?? post.metadata?.categories ?? []
		};
	} catch {
		error(404, 'post not found');
	}
}
