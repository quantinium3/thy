<script lang="ts">
	import * as config from '$lib/config';
	import Project from '$components/Project.svelte';

	const projects = [
		{
			title: 'Dampe',
			description: 'An AI powered file storage',
			tech: ['Nextjs'],
			slug: 'https://github.com/quantinium3/dampe'
		},
		{
			title: 'Grimoire',
			description: 'A Cli static site generator that converts markdown into fully fledged websites',
			tech: ['Rust', 'Comrak'],
			slug: 'https://grimoire.quantinium.dev'
		},
		{
			title: 'Coderunner',
			description: 'an online editor for some fun languages',
			tech: ['Reactjs', 'Rust(Axum)'],
			slug: 'https://coderunner.quantinium.dev',
		},
		{
			title: 'TSH',
			description:
				'tmux sessionizer to create tmux session at a blazingly fast speed and increase productivity',
			tech: ['Rust'],
			slug: 'https://github.com/quantinium3/tsh'
		},
		{
			title: 'Kairos',
			description: 'A self hostable media server',
			tech: ['ReactJS', 'Golang', 'Rust', 'HonoJS'],
			slug: 'https://github.com/quantinium3/kairos',
		},
        {
			title: 'Xunbao',
			description: 'an online quiz platform for a college hackathon',
			tech: ['ReactJS', 'ExpressJS', 'MongoDB', 'ClerkJS'],
			slug: 'https://github.com/quantinium3/xunbao'
        },
		{
			title: 'Tanshilink',
			description: 'url shortener',
			tech: ['ElysiaJS'],
			slug: 'https://github.com/quantinium3/tanshilink'
		},
		{
			title: 'Asami',
			description: 'an ascii art generator to convert normal images into ascii',
			tech: ['Typescript', 'ReactJS'],
			slug: 'https://github.com/quantinium3/asami'
		},
		{
			title: 'Yumi',
			description: 'package manager to fetch npm packages',
			tech: ['Typescript'],
			slug: 'https://github.com/quantinium3/yumi'
		},
		{
			title: 'Ryu',
			description: 'a web server written',
			tech: ['C'],
			slug: 'https://github.com/quantinium3/ryu'
		}
	];
</script>

<svelte:head>
	<title>{config.title}</title>
	<meta name="description" content="quantinium's projects" />
</svelte:head>

<div class="mt-[3rem] flex">
	<div class="pr-0 md:flex-3 md:pr-12">
		{#each projects as project (project.title)}
			<Project {project} />
		{/each}
	</div>

	<div class="hidden flex-1 px-0 py-9 md:block md:px-3">
		{#each projects as project (project.title)}
			<div class="flex">
				<div class="hover:font-semibold hover:underline hover:underline-offset-4">
					-> <a href={project.slug}>{project.title}</a>
				</div>
			</div>
		{/each}
	</div>
</div>
