<script>
	import { fly } from 'svelte/transition';
	import { Moon, Sun } from '@lucide/svelte';
	import { theme } from '$lib/theme.svelte';

	let links = [
		{
			name: 'home',
			href: '/'
		},
		{
			name: 'blog',
			href: '/blog'
		},
		{
			name: 'projects',
			href: '/project'
		},
		{
			name: 'guides',
			href: '/guide'
		},
		{
			name: 'resources',
			href: '/resource'
		},
		{
			name: 'frens',
			href: '/fren'
		}
	];
</script>

<div class="my-5 flex justify-between py-3 dark:text-white">
	<div class="flex items-center text-lg">
		<span class="mr-2">&gt; quantinium</span>
		<span class="animate-pulse">|</span>
	</div>
	<div class="flex flex-wrap justify-center gap-3">
		{#each links as link (link)}
			<span
				>[<a href={link.href} class="hover:underline hover:underline-offset-4">{link.name}</a
				>]</span
			>
		{/each}
		<div>
			<button onclick={theme.toggle} aria-label="Toggle theme">
				{#if theme.current === 'dark'}
					<div in:fly={{ y: 10 }}>
						<Sun />
					</div>
				{:else}
					<div in:fly={{ y: -10 }}>
						<Moon />
					</div>
				{/if}
			</button>
		</div>
	</div>
</div>
