<script lang="ts">
	import * as config from '$lib/config';
	import { formatDate } from '$lib/utils';
	import Server from '$components/Server.svelte';
	import Code from '$components/Code.svelte';
	import CoolButtons from '$components/CoolButtons.svelte';
	import Sidebar from '$components/Sidebar.svelte';
	let { data } = $props();

	const projects = [
		{
			name: 'lomes',
			href: 'https://github.com/quantinium3/lomes',
			description: 'self hosted media server',
			tech: ['reactjs', 'expressjs', 'go']
		},
		{
			name: 'grimoire',
			href: 'https://github.com/quantinium3/grimoire',
			description: 'a static site generator',
			tech: ['typscript', 'handlebars']
		},
		{
			name: 'lated',
			href: 'https://lated.vercel.app/',
			description: 'a latex editor',
			tech: ['reactjs, expressjs']
		},
		{
			name: 'nvgs',
			href: 'https://github.com/quantinium3/nvgs',
			description: 'nvidia gpu switcher for linux',
			tech: ['rust']
		},
		{
			name: 'asami',
			href: 'https://asami.vercel.app',
			description: 'ascii art generator',
			tech: ['reactjs']
		}
	];

</script>

<svelte:head>
	<title>{config.title}</title>
</svelte:head>

<div class="mt-[3rem]">
	<div class="flex">
		<div class="hidden flex-1 flex-col px-3 md:block">
			<Sidebar />
		</div>
		<div class="max-w-fit flex-3 px-3">
			<div class="intro item-center border-b pb-5">
				<div class="item-center mb-3 flex flex-col justify-center gap-3">
					<div class="text-xl font-semibold">Hi, im quantinium</div>
					<div>currently pursuing undergrad in computer engineering</div>
					<div>
						my interests generally revolve around backend and hardware stuff but i can do frontends,
						devops and systems programming. Apart from computers, i enjoy physics, watching anime,
						history, reading books, playing games and eeping.
					</div>
					<div>
						this site is will be in eternal under construction cause i would definitely change it in
						the future.
					</div>
					<div>
						feel free to talk or dm on
						<a href="https://x.com/quantinium3" class="hover:underline" target="_blank">X</a> or discord
						(@quantinium3) or mail
					</div>
					<div><a href="/about" class="hover:underline hover:underline-offset-2">more...</a></div>
				</div>

				<div class="cool-sites">
					<CoolButtons />
				</div>
			</div>

			<div class="border-b py-3">
				<span class="text-xl font-bold">Projects</span>
				<ul class="my-2">
					{#each projects as project (project)}
						<div class="text-md">
							- <a
								href={project.href}
								target="_blank"
								class="hover:underline hover:underline-offset-2">{project.name}</a
							>
							-
							{project.description}
						</div>
					{/each}
				</ul>
				<div>
					<a href="/project" target="_blank" class="hover:underline hover:underline-offset-2"
						>more...</a
					>
				</div>
			</div>

			<div class="border-b py-3">
				<span class="text-xl font-bold">Blog</span>
				<ul class="my-2">
					{#each data.blogs as blog (blog)}
						<div class="text-md">
							- <a href={blog.slug} target="_blank" class="hover:underline hover:underline-offset-2"
								>{blog.title}</a
							>
							-
							{formatDate(blog.date)}
						</div>
					{/each}
				</ul>
				<div>
					<a href="/blog" target="_blank" class="hover:underline hover:underline-offset-2"
						>more...</a
					>
				</div>
			</div>

			<div class="border-b py-3">
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

	.cool-sites {
		margin: 20px 0;
		position: relative;
		height: 33px;
		overflow: hidden;
	}
</style>
