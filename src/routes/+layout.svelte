<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.jpg';
	import Navbar from '$lib/components/navbar.svelte';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<meta property="og:locale" content="en_US" />
</svelte:head>

<main class="mx-auto max-w-200 px-4" style="font-family: 'Menlo', monospace;">
	<Navbar />
	{@render children()}
	<footer class="mt-8 flex justify-end border-t py-4 text-xs opacity-50 dark:border-zinc-400">
		<span>quantinium &copy; {new Date().getFullYear()}</span>
	</footer>
</main>
