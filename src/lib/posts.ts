interface Post {
	slug: string;
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
	};
};

export function loadPosts({ limit, readingTime = false }: LoadOptions = {}): Post[] {
	const posts = import.meta.glob<PostModule>('/content/blog/*.md', { eager: true });
	const rawPosts = import.meta.glob<string>('/content/blog/*.md', {
		eager: true,
		query: '?raw',
		import: 'default'
	});

	const allPosts = Object.entries(posts)
		.map(([path, post]) => {
			const result: Post = {
				slug: path.split('/').pop()?.replace('.md', '') ?? '',
				title: post.metadata?.title ?? 'untitled',
				date: post.metadata?.date ?? '',
				description: post.metadata?.description ?? '',
				tags: post.metadata?.tags ?? []
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
