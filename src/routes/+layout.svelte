<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.jpg';
	import Navbar from '$lib/components/navbar.svelte';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>quantinium</title>
	<meta name="description" content="quantinium's personal website">

	<meta property="og:description" content="quantinium's personal website">
	<meta property="og:type" content="website">
	<meta property="og:url" content="https://quantinium.dev">
	<meta property="og:image" content="https://x2onawsk55.ufs.sh/f/eZ86CwF4BrGdAvv9OSxAcYT9SOR5xq8UkvgJl3HFIE0LfsCX">
	<meta property="og:image:type" content="image/gif">

	<meta name="twitter:card" content="summary_large_image">
	<meta name="twitter:title" content="quantinium">
	<meta name="twitter:description" content="quantinium's personal website">
	<meta name="twitter:image" content="https://x2onawsk55.ufs.sh/f/eZ86CwF4BrGdAvv9OSxAcYT9SOR5xq8UkvgJl3HFIE0LfsCX">
	<meta name="twitter:domain" content="quantinium.dev">
	<meta name="twitter:url" content="https://quantinium.dev">

  <meta property="og:locale" content="en_US" />
</svelte:head>

<main class="mx-auto max-w-200 px-4" style="font-family: 'Menlo', monospace;">
	<Navbar />
	{@render children()}
	<footer class="mt-8 flex justify-end border-t py-4 text-xs opacity-50 dark:border-zinc-400">
		<span>quantinium &copy; {new Date().getFullYear()}</span>
	</footer>
</main>
