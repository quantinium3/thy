import { error } from '@sveltejs/kit';

export async function load({ params }: { params: { category: string; slug: string } }) {
	try {
		const solution = await import(
			`../../../../../content/dsa/${params.category}/${params.slug}.md`
		);
		return {
			content: solution.default,
			category: params.category,
			title: solution.metadata?.title ?? 'untitled',
			date: solution.metadata?.date ?? '',
			description: solution.metadata?.description ?? '',
			tags: solution.metadata?.tags ?? solution.metadata?.categories ?? [],
			problemUrl: solution.metadata?.problemUrl ?? '',
			difficulty: solution.metadata?.difficulty ?? ''
		};
	} catch {
		error(404, 'solution not found');
	}
}
