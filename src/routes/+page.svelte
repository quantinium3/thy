<script lang="ts">
	import * as config from '$lib/config';
	import Song from '$components/Song.svelte';
	import { formatDate } from '$lib/utils';
	import CodeStatus from '$components/CodeStatus.svelte';
	import Peripheral from '$components/Peripheral.svelte';
	import Server from '$components/Server.svelte';
	import Code from '$components/Code.svelte';
	import { Github, Twitter, Mail, Copyright} from '@lucide/svelte';
	let { data } = $props();

	const links = [
		{
			name: 'home',
			href: '/'
		},
		{
			name: 'about',
			href: '/about'
		},
		{
			name: 'project',
			href: '/project'
		},
		{
			name: 'blog',
			href: '/blog'
		},
		{
			name: 'github',
			href: 'https://github.com/quantinium3'
		},
		{
			name: 'last.fm',
			href: 'https://www.last.fm/user/Quantinium_X'
		},
		{
			name: 'contact',
			href: '/about#contact'
		},
		{
			name: "logs",
			href: '/logs'
		},
		{
			name: "spotify",
			href: "https://open.spotify.com/user/alcivd1065ibqww5vo9hemnus?si=9626e0194c4e418f"
		},
		{
			name: "rss",
			href: "/rss-xml"
		},
	];

	const projects = [
		{
			name: "lomes",
			href: 'https://github.com/quantinium3/lomes',
			description: "self hosted media server",
			tech: ["reactjs", "expressjs", "go"]
		},
		{
			name: "grimoire",
			href: 'https://github.com/quantinium3/grimoire',
			description: "a static site generator",
			tech: ["typscript", "handlebars"]
		},
		{
			name: "lated",
			href: 'https://lated.vercel.app/',
			description: "a latex editor",
			tech: ["reactjs, expressjs"]
		},
		{
			name: "nvgs",
			href: 'https://github.com/quantinium3/nvgs',
			description: "nvidia gpu switcher for linux",
			tech: ["rust"]
		},
		{
			name: "asami",
			href: 'https://asami.vercel.app',
			description: "ascii art generator",
			tech: ["reactjs"]
		},
	];
</script>

<svelte:head>
	<title>{config.title}</title>
</svelte:head>

<div class="mt-3 md:mt-9">
	<div class="flex">
		<div class="flex-1 flex-col px-3">
			<div class="flex flex-col item-center justify-center">
				<img src="/favicon.jpg" alt="pfp"
						 class="rounded self-center" />
				<span class="text-center text-lg py-1">online</span>
			</div>
			<div class="my-5">
				<span class="text-lg font-bold">navi</span>
				{#each links as link (link.href)}
					<div class="ml-2 flex flex-row gap-1 border-l border-white">
						<span>–</span>
						<span><a href={link.href}
										 class="link-animate pt-1">{link.name}</a></span>
					</div>
				{/each}
				<span class="ml-1 relative bottom-[1.02px]">└
					<a href="/resume" class="link-animate">resume</a></span>
			</div>

			<div class="my-5">
				<Song />
			</div>

			<div class="my-5">
				<CodeStatus totalTime={data.totalTime}/>
			</div>

			<div class="my-5">
				<Peripheral />
			</div>

			<div class="border-t py-3">
				<Copyright class="inline" size={15}/>quantinium
				{new Date().getFullYear()}
			</div>
			<div class="flex gap-3">
				<a href="https://github.com/quantinium3" target="_blank"><Github /></a>
				<a href="https://x.com/quantinium3" target="_blank"><Twitter /></a>
				<a href="mailto:quant@quantinium.dev" target="_blank"><Mail /></a>
			</div>
		</div>
		<div class="flex-3 px-3">
			<div class="intro item-center border-b pb-5">
				<div class="item-center flex flex-col justify-center gap-3">
					<div class="font-semibold text-xl">Hi, im quantinium</div>
					<div>currently pursuing undergrad in computer engineering</div>
					<div>
						my interests generally revolve around backend and hardware
						stuff but i can do frontends, devops and systems programming.
						Apart from computers, i enjoy physics, watching anime, history,
						reading books,
						playing games and eeping.
					</div>
					<div>this site is will be in eternal under construction cause i
						would definitely change it in the future.</div>
					<div>feel free to talk or dm on
						<a href="https://x.com/quantinium3" class="hover:underline"
							 target="_blank">X</a> or discord (@quantinium3) or mail</div>
					<div><a href="/about" class="hover:underline hover:underline-offset-2">more...</a></div>
				</div>
			</div>

			<div class="py-3 border-b">
				<span class="text-xl font-bold">Projects</span>
				<ul class="my-2">
					{#each projects as project (project)}
						<div class="text-md"> - <a href={project.href} target="_blank" class="hover:underline hover:underline-offset-2">{project.name}</a> -
							{project.description}</div>
					{/each}
				</ul>
				<div><a href="/project" target="_blank"
								class="hover:underline hover:underline-offset-2">more...</a></div>
			</div>

			<div class="py-3 border-b">
				<span class="text-xl font-bold">Blog</span>
				<ul class="my-2">
					{#each data.blogs as blog (blog)}
						<div class="text-md"> - <a href={blog.slug} target="_blank"
																			 class="hover:underline hover:underline-offset-2">{blog.title}</a> -
							{formatDate(blog.date)}</div>
					{/each}
				</ul>
				<div><a href="/blog" target="_blank"
								class="hover:underline hover:underline-offset-2">more...</a></div>
			</div>

			<div class="py-3 border-b">
				<Server />
			</div>

			<div class="mb-10">
				<Code />
			</div>

		</div>
	</div>
</div>

<style>
	.link-animate {
		position: relative;
		text-decoration: none;
	}

	.link-animate:hover {
		right: 0;
		text-decoration: none;
	}

	.link-animate:hover:after {
		right: 0;
	}

	.link-animate:after {
		border-radius: 1em;
		border-top: 0.1em solid;
		content: '';
		position: absolute;
		right: 100%;
		bottom: 0.14em;
		left: 0;
		transition:
			right 0.4s cubic-bezier(0, 0.5, 0, 1),
			border-color 0.4s ease-out;
	}

	.link-animate:hover:after {
		right: 0;
	}
</style>
