<script lang="ts">
	//import { fly } from 'svelte/transition';
	//import { Moon, Sun } from '@lucide/svelte';
	//import { theme } from '$lib/theme.svelte';

	let { toggleSidebar } = $props();

	let links = [
		// {
		// 	name: 'home',
		// 	href: '/'
		// },
        //{
        //    name: 'about',
        //    href: "/about"
        //},
		//{
		//	name: 'blog',
		//	href: '/blog'
		//},
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

<div
	class="fixed top-0 left-1/2 z-1 flex h-[3rem] w-full max-w-5xl -translate-x-1/2 transform items-center justify-between bg-[#FCFAF6]/90 px-3 lg:px-0 py-[1rem] dark:bg-[#161411]/90"
>
	<div class="flex items-center space-x-1 font-bold text-orange-400 dark:text-orange-300">
		<span class="text-md flex items-center font-bold text-[#fabd2f]">
			<button class="pointer-events-auto mr-2 md:pointer-events-none" onclick={toggleSidebar}
				>></button
			>
			<a href="/" class="flex text-lg whitespace-nowrap">quantinium</a><span
				class="ml-1 animate-pulse text-lg"
				>|
			</span>
		</span>
	</div>

	<div class="flex gap-2">
		<div class="flex flex-wrap items-center gap-2 text-md md:text-lg">
			{#each links as link (link.name)}
				[<a
					href={link.href}
					class="text-black hover:underline hover:underline-offset-2 dark:text-white dark:hover:border-b-white"
					>{link.name}</a
				>]
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
