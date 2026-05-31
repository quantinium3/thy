<script lang="ts">
	import FileTree from '$lib/components/file-tree.svelte';
	import Listening from '$lib/components/listening.svelte';
	import Stats from '$lib/components/stats.svelte';
	import InputStats from '$lib/components/input-stats.svelte';
	import WakatimeCharts from '$lib/components/wakatime-charts.svelte';
	import ImageCarousel from '$lib/components/image-carousel.svelte';
	import { projects } from '$lib/projects';
	import { ArrowRight } from '@lucide/svelte';
	import { slide } from 'svelte/transition';
	import { sidebar } from '$lib/sidebar.svelte';
	import { resolve } from '$app/paths';
	let { data } = $props();

	function truncate(text: string, words = 20) {
		const parts = text.split(' ');
		return parts.length <= words ? text : parts.slice(0, words).join(' ') + '…';
	}
</script>

{#if sidebar.open}
	<aside
		transition:slide={{ duration: 200 }}
		class="flex flex-col gap-3 border-b py-3 md:hidden dark:border-zinc-400"
	>
		<ImageCarousel />
		<FileTree />
	</aside>
{/if}

<div class="flex w-full gap-6 py-3">
	<aside class="hidden w-1/4 shrink-0 flex-col gap-3 md:flex">
		<ImageCarousel />
		<FileTree />
		<Listening />
		<Stats />
		<InputStats />
	</aside>

	<main class="flex w-full flex-col">
		<div class="border-b dark:border-zinc-400">
			<div>
				<h2 class="font-bold">Hi, I'm quantinium</h2>
				<span class="text-sm opacity-70">compsci undergrad</span>
			</div>
			<div class="space-y-3 py-3">
				<p>
					This is my personal website and a place to store all the stuff that i write, make and
					like. My interests generally revolve around backend and hardware stuff but i can do
					frontends, devops and systems programming. Apart from computers, i enjoy physics, watching
					anime, history, reading books, playing games.
				</p>
				<p>
					Feel free to talk or dm on <a
						href="https://twitter.com/quantinium3"
						class="text-blue-700 dark:text-blue-400">[X]</a
					> or discord (@quantinium3) or pigeons.
				</p>
				<p class="opacity-70">open to new roles</p>
			</div>
		</div>

		<div class="border-b pb-3 dark:border-zinc-400">
			<div class="flex items-center justify-between py-3">
				<h1 class="font-bold">Blog</h1>
				<a
					href={resolve('/blog')}
					class="flex items-center gap-1 text-xs opacity-50 hover:opacity-100"
					>see all <ArrowRight size={12} /></a
				>
			</div>
			<div>
				{#each data.posts as post (post.slug)}
					<div class="space-y-0.5">
						<div class="flex flex-wrap items-baseline gap-3">
							<a
								href={resolve(`/blog/${post.slug}`)}
								class="font-bold text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
								>[{post.title}]</a
							>
							<span class="text-xs opacity-50"
								>{Intl.DateTimeFormat('en-GB', { dateStyle: 'medium' }).format(
									new Date(post.date)
								)}</span
							>
						</div>
						{#if post.description}
							<p class="text-sm opacity-80">{truncate(post.description)}</p>
						{/if}
					</div>
				{/each}
			</div>
		</div>

		<div class="border-b pb-3 dark:border-zinc-400">
			<div class="flex items-center justify-between py-3">
				<h1 class="font-bold">Projects</h1>
				<a
					href={resolve('/project')}
					class="flex items-center gap-1 text-xs opacity-50 hover:opacity-90"
					>see all <ArrowRight size={12} /></a
				>
			</div>
			<div class="flex flex-col space-y-1">
				{#each projects.slice(0, 4) as project (project.name)}
					<div>
						<div class="flex flex-wrap items-baseline gap-3">
							{#if project.repo}
								<a
									href={project.repo}
									target="_blank"
									rel="noopener noreferrer external"
									class="font-bold text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
								>
									[{project.name}]
								</a>
							{:else}
								<span class="font-bold">[{project.name}]</span>
							{/if}
							<span class="text-xs opacity-70">{project.status}</span>
						</div>
						<p class="text-sm opacity-80">{truncate(project.description)}</p>
					</div>
				{/each}
			</div>
		</div>

		<WakatimeCharts />

		<div class="flex flex-col gap-3 pt-3 md:hidden">
			<Listening />
			<Stats />
			<InputStats />
		</div>
	</main>
</div>
