<script lang="ts">
	import { fly } from 'svelte/transition';
	import { Moon, Sun } from '@lucide/svelte';
	import { theme } from '$lib/theme.svelte';

	let { toggleSidebar } = $props();

	let links = [
		// {
		// 	name: 'home',
		// 	href: '/'
		// },
		// {
		// 	name: 'blog',
		// 	href: '/blog'
		// },
		{
			name: 'projects',
			href: '/project'
		}
		// {
		// 	name: 'guides',
		// 	href: '/guide'
		// },
		// {
		// 	name: 'resources',
		// 	href: '/resource'
		// },
		// {
		// 	name: 'frens',
		// 	href: '/fren'
		// }
	];
</script>

<div class="mx-auto pr-5 max-w-5xl flex h-[3rem] items-center justify-between w-full py-[1rem] fixed top-0 dark:bg-[#161411]/90 bg-[#FCFAF6]/90 z-1">
	<div class="flex items-center space-x-1 font-bold text-orange-400 dark:text-orange-300">
		<span class="text-md flex items-center font-bold text-[#fabd2f]">
			<button class="mr-2 pointer-events-auto md:pointer-events-none" onclick={toggleSidebar}>></button>
			<a href="/" class="flex text-lg whitespace-nowrap">quantinium</a><span
				class="animate-pulse ml-1 text-lg"
				>|
			</span>
		</span>
	</div>

	<div class="flex gap-2">
		<div class="flex flex-wrap items-center gap-2">
			{#each links as link (link.name)}
				<a
					href={link.href}
					class="link-animate text-black dark:text-white dark:hover:border-b-white">{link.name}</a
				>
			{/each}
		</div>
		<!-- <div class="flex items-center gap-3">
			<button onclick={theme.toggle} aria-label="Toggle theme">
				{#if theme.current === 'dark'}
					<div in:fly={{ y: 10 }}>
						<Sun size={15} />
					</div>
				{:else}
					<div in:fly={{ y: -10 }}>
						<Moon size={15} />
					</div>
				{/if}
			</button>
		</div> -->
	</div>
</div>

<style>
	.link-animate {
		position: relative;
		text-decoration: none;
		transition: color 0.6s ease-out;
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
