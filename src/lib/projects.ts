export type Project = {
	name: string;
	description: string;
	tags: string[];
	url?: string;
	repo?: string;
	image?: string;
	status: 'active' | 'finished' | 'wip' | 'abandoned';
};

export const projects: Project[] = [
	{
		name: 'lyra',
		description:
			'an electron desktop app that simplifies server management, deployment and instaliing packages',
		tags: ['rust', 'typescript', 'electron'],
		repo: 'https://github.com/quantinium3/lyra',
		status: 'active'
	},
	{
		name: 'codecop',
		description:
			'ai-powered code review platform that provides automated, line-by-line feedback and context-aware merge request summaries to speed up the development lifecycle',
		tags: ['typescript', 'cloudflare'],
		repo: 'https://github.com/quantinium3/codecop',
		status: 'active'
	},
	{
		name: 'grimoire',
		description: 'a cli static site generator',
		tags: ['rust'],
		repo: 'https://github.com/quantinium3/grimoire',
		status: 'finished'
	},
	{
		name: 'drew',
		description:
			'a virtual, collaborative whiteboard tool that lets you sketch hand-drawn-style diagrams',
		tags: ['typescript', 'react'],
		repo: 'https://github.com/quantinium3/drew',
		status: 'finished'
	}
];
