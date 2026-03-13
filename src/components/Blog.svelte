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
	<h1 class="mb-3 text-xl font-semibold text-[#fe8019]">
		<a href="/blog/{blog.slug}" class="hover:underline hover:underline-offset-2">
			{blog.title}
		</a>
	</h1>

	<div class="mb-4 flex flex-wrap items-center gap-2 text-sm text-zinc-400">
		<span class="shrink-0">{formatDate(blog.date)}</span>
		<span class="text-zinc-600">·</span>
		<div class="flex flex-wrap gap-2">
			{#each blog.categories as category (category)}
				<span class="rounded-full bg-zinc-800 px-2 py-0.5 text-xs text-zinc-300">
					#{category.replaceAll('_', ' ')}
				</span>
			{/each}
		</div>
	</div>

	<p class="mb-4 text-sm">{blog.description}</p>

	<a
		href="/blog/{blog.slug}"
		class="w-fit text-sm text-[#fe8019] hover:underline hover:underline-offset-2"
	>
		read more →
	</a>
</div>
