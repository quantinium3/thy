<script lang="ts">
	import { resolve } from '$app/paths';
	const links = [
		{ name: '', href: '/', external: false, reload: false },
		{ name: 'about', href: '/about', external: false, reload: false },
		{ name: 'project', href: '/project', external: false, reload: false },
		{ name: 'blog', href: '/blog', external: false, reload: false },
		{ name: 'github', href: 'https://github.com/quantinium3', external: true, reload: false },
		{
			name: 'last.fm',
			href: 'https://www.last.fm/user/Quantinium_X',
			external: true,
			reload: false
		},
		{ name: 'contact', href: '/about#contact', external: false, reload: false },
		{ name: 'twitter', href: 'https://twitter.com/quantinium3', external: true, reload: false },
		{ name: 'rss', href: '/rss.xml', external: false, reload: true },
		{ name: 'mail', href: 'mailto:hey@quantinium.dev', external: true, reload: false }
	];
</script>

<div class="text-sm">
	<span class="block pb-1 text-lg font-bold">Navi</span>
	{#each links as link, i (link.name)}
		<div class="flex items-center gap-1">
			<span class="shrink-0 opacity-70">{i === links.length - 1 ? '└──' : '├──'}</span>
			{#if link.external}
				<a
					href={link.href}
					class="truncate text-blue-700 hover:underline dark:text-blue-400"
					target="_blank"
					rel="noopener noreferrer external">[/{link.name}]</a
				>
			{:else}
				{@const href = resolve(link.href)}
				<a
					{href}
					class="truncate text-blue-700 hover:underline dark:text-blue-400"
					data-sveltekit-reload={link.reload ? '' : undefined}>[/{link.name}]</a
				>
			{/if}
		</div>
	{/each}
</div>
