<script lang="ts">
	import { page } from '$app/state';
	import ogGif from '$lib/assets/og.gif';

	const SITE = 'https://quantinium.dev';

	const AUTHOR = {
		'@type': 'Person',
		name: 'quantinium',
		url: `${SITE}/about`,
		sameAs: ['https://github.com/quantinium3', 'https://x.com/quantinium3']
	};

	let {
		title,
		description,
		type = 'website',
		date,
		tags = []
	}: {
		title: string;
		description: string;
		type?: 'website' | 'article';
		date?: string;
		tags?: string[];
	} = $props();

	const fullTitle = $derived(title === 'quantinium' ? title : `${title} | quantinium`);
	const url = $derived(`${SITE}${page.url.pathname}`);
	const image = $derived(`${SITE}${ogGif}`);

	const ld = (data: unknown) => JSON.stringify(data).replace(/</g, '\\u003c');

	const schema = $derived.by(() => {
		if (type === 'article') {
			const section = page.url.pathname.split('/').filter(Boolean)[0] ?? '';
			return [
				{
					'@context': 'https://schema.org',
					'@type': 'BlogPosting',
					headline: title,
					description,
					...(date ? { datePublished: date, dateModified: date } : {}),
					...(tags.length ? { keywords: tags.join(', ') } : {}),
					author: AUTHOR,
					publisher: AUTHOR,
					image,
					url,
					mainEntityOfPage: { '@type': 'WebPage', '@id': url },
					inLanguage: 'en'
				},
				{
					'@context': 'https://schema.org',
					'@type': 'BreadcrumbList',
					itemListElement: [
						{ '@type': 'ListItem', position: 1, name: 'quantinium', item: SITE },
						...(section
							? [{ '@type': 'ListItem', position: 2, name: section, item: `${SITE}/${section}` }]
							: []),
						{ '@type': 'ListItem', position: section ? 3 : 2, name: title, item: url }
					]
				}
			];
		}

		if (page.url.pathname === '/about') {
			return [
				{
					'@context': 'https://schema.org',
					'@type': 'ProfilePage',
					url,
					inLanguage: 'en',
					mainEntity: AUTHOR
				}
			];
		}

		if (page.url.pathname === '/') {
			return [
				{
					'@context': 'https://schema.org',
					'@type': 'WebSite',
					name: 'quantinium',
					url: SITE,
					description,
					inLanguage: 'en',
					author: AUTHOR
				},
				{ '@context': 'https://schema.org', ...AUTHOR }
			];
		}

		return [];
	});
</script>

<svelte:head>
	<title>{fullTitle}</title>
	<meta name="description" content={description}>

	<meta property="og:title" content={fullTitle}>
	<meta property="og:description" content={description}>
	<meta property="og:type" content={type}>
	<meta property="og:url" content={url}>
	<meta property="og:image" content={image}>
	<meta property="og:image:type" content="image/gif">

	<meta name="twitter:card" content="summary_large_image">
	<meta name="twitter:title" content={fullTitle}>
	<meta name="twitter:description" content={description}>
	<meta name="twitter:image" content={image}>
	<meta name="twitter:domain" content="quantinium.dev">
	<meta name="twitter:url" content={url}>

	{#each schema as node, i (i)}
		{@html `<script type="application/ld+json">${ld(node)}</script>`}
	{/each}
</svelte:head>
