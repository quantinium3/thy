<script lang="ts">
	import ChevronLeft from '@lucide/svelte/icons/chevron-left';
	import type { Component, Snippet } from 'svelte';
	import Prose from './prose.svelte';
	import Seo from './seo.svelte';

	let {
		backHref,
		backLabel,
		title,
		date,
		description,
		tags,
		content,
		meta
	}: {
		backHref: string;
		backLabel: string;
		title: string;
		date: string;
		description: string;
		tags: string[];
		content: Component;
		meta?: Snippet;
	} = $props();
</script>

<Seo {title} {description} {date} {tags} type="article" />

<article class="py-4">
	<!-- eslint-disable svelte/no-navigation-without-resolve -- backHref is resolved by the caller -->
	<a
		href={backHref}
		class="mb-4 inline-flex items-center gap-0.5 text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
	>
		<span class="flex items-center"><ChevronLeft size={14} /></span>{backLabel}
	</a>

	<div class="mb-6 border-b pb-4 dark:border-zinc-400">
		<h1 class="font-bold">{title}</h1>
		<p class="mt-1 text-xs opacity-70">
			{Intl.DateTimeFormat('en-GB', {
				dateStyle: 'full'
			}).format(new Date(date))}
		</p>
		{#if meta}
			<div class="mt-2 flex flex-wrap items-center gap-2 text-xs">{@render meta()}</div>
		{/if}
		{#if description}
			<p class="my-2 text-sm opacity-90">{description}</p>
		{/if}
		{#if tags.length}
			<div class="mt-2 flex gap-2">
				{#each tags as tag (tag)}
					<span class="text-xs text-emerald-600 dark:text-emerald-400">&lbrace;{tag}&rbrace;</span>
				{/each}
			</div>
		{/if}
	</div>

	<Prose {content} />
</article>
