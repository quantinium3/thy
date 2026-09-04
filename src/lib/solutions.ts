export interface Solution {
	slug: string;
	category: string;
	href: string;
	title: string;
	date: string;
	description: string;
	tags: string[];
	problemUrl?: string;
	difficulty?: string;
	readingTime: number;
}

export interface Category {
	name: string;
	count: number;
}

type SolutionModule = {
	metadata?: {
		title?: string;
		date?: string;
		description?: string;
		tags?: string[];
		categories?: string[];
		problemUrl?: string;
		difficulty?: string;
	};
};

const modules = import.meta.glob<SolutionModule>('/content/dsa/*/*.md', { eager: true });
const raw = import.meta.glob<string>('/content/dsa/*/*.md', {
	eager: true,
	query: '?raw',
	import: 'default'
});

const all: Solution[] = Object.entries(modules)
	.map(([path, mod]) => {
		// /content/dsa/<category>/<slug>.md
		const [, , , category, file] = path.split('/');
		const slug = file.replace(/\.md$/, '');

		const body = (raw[path] ?? '').replace(/^---[\s\S]*?---/, '');
		const words = body.trim().split(/\s+/).filter(Boolean).length;

		const solution: Solution = {
			slug,
			category,
			href: `/dsa/${category}/${slug}`,
			title: mod.metadata?.title ?? 'untitled',
			date: mod.metadata?.date ?? '',
			description: mod.metadata?.description ?? '',
			tags: mod.metadata?.tags ?? mod.metadata?.categories ?? [],
			readingTime: Math.max(1, Math.round(words / 200))
		};

		if (mod.metadata?.problemUrl) solution.problemUrl = mod.metadata.problemUrl;
		if (mod.metadata?.difficulty) solution.difficulty = mod.metadata.difficulty;

		return solution;
	})
	.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

export function loadSolutions(category?: string): Solution[] {
	return category ? all.filter((s) => s.category === category) : all;
}

export function loadCategories(): Category[] {
	const counts = new Map<string, number>();
	for (const s of all) counts.set(s.category, (counts.get(s.category) ?? 0) + 1);
	return [...counts]
		.map(([name, count]) => ({ name, count }))
		.sort((a, b) => a.name.localeCompare(b.name));
}
