export type Collection = 'blog' | 'learnings' | 'misc';

interface Post {
	slug: string;
	collection: Collection;
	href: string;
	title: string;
	date: string;
	description: string;
	tags: string[];
	readingTime?: number;
}

interface LoadOptions {
	limit?: number;
	readingTime?: boolean;
}

type PostModule = {
	metadata?: {
		title?: string;
		date?: string;
		description?: string;
		tags?: string[];
		categories?: string[];
	};
};

export function loadPosts(
	collection: Collection,
	{ limit, readingTime = false }: LoadOptions = {}
): Post[] {
	const posts = import.meta.glob<PostModule>('/content/*/*.md', { eager: true });
	const rawPosts = import.meta.glob<string>('/content/*/*.md', {
		eager: true,
		query: '?raw',
		import: 'default'
	});

	const prefix = `/content/${collection}/`;

	const allPosts = Object.entries(posts)
		.filter(([path]) => path.startsWith(prefix))
		.map(([path, post]) => {
			const slug = path.split('/').pop()?.replace('.md', '') ?? '';
			const result: Post = {
				slug,
				collection,
				href: `/${collection}/${slug}`,
				title: post.metadata?.title ?? 'untitled',
				date: post.metadata?.date ?? '',
				description: post.metadata?.description ?? '',
				tags: post.metadata?.tags ?? post.metadata?.categories ?? []
			};

			if (readingTime) {
				const raw = rawPosts[path] ?? '';
				const body = raw.replace(/^---[\s\S]*?---/, '');
				const words = body.trim().split(/\s+/).filter(Boolean).length;
				result.readingTime = Math.max(1, Math.round(words / 200));
			}

			return result;
		})
		.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

	return limit ? allPosts.slice(0, limit) : allPosts;
}
