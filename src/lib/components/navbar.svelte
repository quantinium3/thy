<script>
	import { Terminal } from '@lucide/svelte';
	import ThemeSwitcher from './theme-switcher.svelte';
	import OnekoPicker from './oneko-picker.svelte';
	import { sidebar } from '$lib/sidebar.svelte';
	import { page } from '$app/state';
	import { resolve } from '$app/paths';

	const isHome = $derived(page.url.pathname === '/');
</script>

<nav class="flex items-center justify-between border-b border-zinc-500 py-2">
	<div class="flex items-center gap-1">
		{#if isHome}
			<button
				class="flex items-center gap-1 hover:opacity-70 md:hidden"
				onclick={() => sidebar.toggle()}
				aria-label="Toggle sidebar"
			>
				<Terminal size={16} />
			</button>
		{/if}
		<a href={resolve('/')} class="flex items-center gap-1 hover:underline">
			<div class="flex items-center space-x-2">
				<Terminal size={16} class="hidden md:block" />
				<h1 class="font-bold">quantinium</h1>
			</div>
			<span class="animate-pulse font-bold">|</span>
		</a>
	</div>
	<div class="flex items-center gap-2">
		<OnekoPicker />
		<ThemeSwitcher />
	</div>
</nav>
