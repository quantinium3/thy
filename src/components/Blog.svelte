<script lang="ts">
	import { formatDate } from '$lib/utils';
	import * as config from '$lib/config';
	let { blog } = $props();
</script>

<svelte:head>
	<title>{config.title}</title>
	<meta name="description" content={blog.description} />
</svelte:head>

<div class="flex flex-col border-b border-dashed border-zinc-500/50 py-9">
	<div class=" mb-1">
		<h1 class="text-xl font-semibold text-[#fe8019]">
			<a
				href="/blog/{blog.slug}"
				class="hover:underline hover:underline-offset-2 dark:hover:border-b-white">{blog.title}</a
			>
		</h1>
	</div>

	<div class="mb-5 flex gap-3">
		<p class="border-r pr-2 text-xs text-zinc-900 dark:text-zinc-100">{formatDate(blog.date)}</p>
		{#each blog.categories as category (category)}
			<span class="text-xs">#{category.replaceAll('_', ' ')}</span>
		{/each}
	</div>

	<div class="text-sm">{blog.description}</div>

	<div>
		<a href="/blog/{blog.slug}" class="underline-offset-2 hover:font-semibold hover:underline"
			>read more...</a
		>
	</div>
</div>
