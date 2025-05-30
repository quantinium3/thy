<script>
	import { fly } from 'svelte/transition';
	import { Moon, Sun } from '@lucide/svelte';
	import { theme } from '$lib/theme.svelte';
	const links = [
		{
			name: 'e',
			href: '/me',
			key: 'm'
		},
		{
			name: 'rojects',
			href: '/projects',
			key: 'p'
		},
		{
			name: 'log',
			href: '/blogs',
			key: 'b'
		},
		{
			name: 'otes',
			href: '/notes',
			key: 'n'
		},
		{
			name: 'and',
			href: '/rand',
			key: 'r'
		}
	];
</script>

<div class="mx-5 my-3 flex items-center justify-between">
	<div class="mr-11 flex items-center text-2xl">
		<div class="link-animate pb-2 text-center"><a class="" href="/">@quantinium</a></div>
	</div>
	<div class="flex flex-wrap gap-3 text-lg">
		{#each links as link (link.name)}
			<a href={link.href} class="link-animate"
				>[<span>{link.key}]</span>{link.name}</a
			>
		{/each}
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

<style>
	.link-animate {
		position: relative;
		display: inline-block;
		overflow: hidden;
	}

	.link-animate::after {
		content: '';
		position: absolute;
		left: 0;
		bottom: 0;
		width: 0%;
		height: 2px;
		background-color: #f0f0f0;
		transition: width 0.3s ease;
	}

	.link-animate:hover::after {
		width: 100%;
	}
</style>

