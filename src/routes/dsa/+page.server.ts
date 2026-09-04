import { loadCategories, loadSolutions } from '$lib/solutions';

export async function load() {
	return { solutions: loadSolutions(), categories: loadCategories() };
}
