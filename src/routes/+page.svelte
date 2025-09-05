<script lang="ts">
	import * as config from '$lib/config';
	import { formatDate } from '$lib/utils';
	import Server from '$components/Server.svelte';
	import Code from '$components/Code.svelte';
	import CoolButtons from '$components/CoolButtons.svelte';
	import Sidebar from '$components/Sidebar.svelte';
	import CodeStatus from '$components/CodeStatus.svelte';
	import Peripheral from '$components/Peripheral.svelte';
	import Song from '$components/Song.svelte';
	let { data } = $props();

	const projects = [
		{
			name: 'grimoire',
			href: 'https://github.com/quantinium3/grimoire',
			description: 'a cli static site generator',
			tech: ['Rust']
		},
		{
			name: 'coderunner',
			href: 'https://coderunner.quantinium.dev/',
			description: 'an online code editor',
			tech: ['reactjs, expressjs']
		},
		{
			name: 'dampe',
			href: 'https://github.com/quantinium3/dampe',
			description: 'ai powered file storage',
			tech: ['nextjs']
		},
		{
			name: 'asami',
			href: 'https://asami.vercel.app',
			description: 'ascii art generator',
			tech: ['reactjs']
		},
		{
			name: 'kairos',
			href: 'https://github.com/quantinium3/kairos',
			description: 'self hosted media server',
			tech: ['reactjs', 'golang', 'rust', 'honojs']
		}
	];
</script>

<svelte:head>
	<title>{config.title}</title>
	<meta name="robots" content="index, follow" />
</svelte:head>

<div class="mt-[4rem]">
	<div class="flex">
		<div class="hidden flex-1 flex-col px-3 md:block">
			<Sidebar />
		</div>
		<div class="max-w-fit flex-3 px-3">
			<div class="intro item-center border-b">
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
						(@quantinium3) or pigeons.
					</div>
					<div class="font-bold underline">Open to new roles</div>
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
							- <a href="/blog/{blog.slug}" class="hover:underline hover:underline-offset-2"
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

			<div class="block md:hidden">
				<div class="border-b py-3">
					<Peripheral />
				</div>

				<div class="border-b py-3">
					<CodeStatus />
				</div>

				<div class="border-b py-3">
					<Song />
				</div>
			</div>

			<div class="mb-10">
				<Code />
			</div>
		</div>
	</div>
</div>

<style>
	.cool-sites {
		margin: 20px 0;
		position: relative;
		height: 33px;
		overflow: hidden;
	}
</style>
