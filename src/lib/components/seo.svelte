<script lang="ts">
	import { page } from '$app/state';
	import ogGif from '$lib/assets/og.gif';

	let {
		title,
		description,
		type = 'website'
	}: {
		title: string;
		description: string;
		type?: 'website' | 'article';
	} = $props();

	const fullTitle = $derived(title === 'quantinium' ? title : `${title} | quantinium`);
	const url = $derived(`https://quantinium.dev${page.url.pathname}`);
</script>

<svelte:head>
	<title>{fullTitle}</title>
	<meta name="description" content={description}>

	<meta property="og:title" content={fullTitle}>
	<meta property="og:description" content={description}>
	<meta property="og:type" content={type}>
	<meta property="og:url" content={url}>
	<meta property="og:image" content={ogGif}>
	<meta property="og:image:type" content="image/gif">

	<meta name="twitter:card" content="summary_large_image">
	<meta name="twitter:title" content={fullTitle}>
	<meta name="twitter:description" content={description}>
	<meta name="twitter:image" content={ogGif}>
	<meta name="twitter:domain" content="quantinium.dev">
	<meta name="twitter:url" content={url}>
</svelte:head>
