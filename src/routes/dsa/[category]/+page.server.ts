import { error } from '@sveltejs/kit';
import { loadCategories, loadSolutions } from '$lib/solutions';

export async function load({ params }) {
	const categories = loadCategories();
	if (!categories.some((c) => c.name === params.category)) {
		error(404, 'category not found');
	}

	return {
		category: params.category,
		solutions: loadSolutions(params.category),
		categories
	};
}
