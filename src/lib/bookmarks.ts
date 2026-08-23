export type Bookmark = {
	title: string;
	url: string;
	category: string;
	description?: string;
};

export const bookmarks: Bookmark[] = [
	{
		title: 'nix pills',
		url: 'https://nixos.org/guides/nix-pills/',
		category: 'language',
		description: 'builds up the nix language and store model from first principles'
	},
	{
		title: 'the rust performance book',
		url: 'https://nnethercote.github.io/perf-book/',
		category: 'language',
		description: 'practical techniques for making rust programs faster'
	},
	{
		title: 'rustonomicon',
		url: 'https://doc.rust-lang.org/nomicon/',
		category: 'language',
		description: 'the dark arts of unsafe rust'
	},
	{
		title: 'what every programmer should know about memory',
		url: 'https://people.freebsd.org/~lstewart/articles/cpumemory.pdf',
		category: 'systems'
	},
	{
		title: 'high scalability',
		url: 'http://highscalability.com/',
		category: 'systems',
		description: 'architecture write-ups of large systems'
	},
	{
		title: 'julia evans',
		url: 'https://jvns.ca/',
		category: 'blogs',
		description: 'debugging, networking and unix internals explained well'
	},
	{
		title: 'dan luu',
		url: 'https://danluu.com/',
		category: 'blogs',
		description: 'hardware, latency and engineering culture essays'
	},
	{
		title: 'brendan gregg',
		url: 'https://www.brendangregg.com/',
		category: 'blog',
		description: 'linux performance, flame graphs and observability'
	},
	{
		title: 'crafting interpreters',
		url: 'https://craftinginterpreters.com/',
		category: 'books',
		description: 'writing a tree-walking and a bytecode interpreter end to end'
	},
	{
		title: 'designing data-intensive applications',
		url: 'https://dataintensive.net/',
		category: 'books',
		description: 'storage engines, replication and consensus'
	},
	{
		title: 'excalidraw',
		url: 'https://excalidraw.com/',
		category: 'tools',
		description: 'quick hand-drawn style diagrams'
	},
	{
		title: 'godbolt compiler explorer',
		url: 'https://godbolt.org/',
		category: 'tools',
		description: 'see the assembly your code compiles to'
	},
	{
		title: 'regex101',
		url: 'https://regex101.com/',
		category: 'tools',
		description: 'regex playground with an explanation pane'
	}
];

export const categories: string[] = [...new Set(bookmarks.map((b) => b.category))];

export function groupByCategory(items: Bookmark[]): [string, Bookmark[]][] {
	const groups = new Map<string, Bookmark[]>();
	for (const item of items) {
		const group = groups.get(item.category);
		if (group) group.push(item);
		else groups.set(item.category, [item]);
	}
	return [...groups];
}

export function hostname(url: string): string {
	try {
		return new URL(url).hostname.replace(/^www\./, '');
	} catch {
		return url;
	}
}
