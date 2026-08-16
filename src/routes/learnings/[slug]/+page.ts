import { error } from '@sveltejs/kit';

export async function load({ params }: { params: { slug: string } }) {
	try {
		const learning = await import(`../../../../content/learnings/${params.slug}.md`);
		return {
			content: learning.default,
			title: learning.metadata?.title ?? 'untitled',
			date: learning.metadata?.date ?? '',
			description: learning.metadata?.description ?? '',
			tags: learning.metadata?.tags ?? learning.metadata?.categories ?? []
		};
	} catch {
		error(404, 'learning not found');
	}
}
