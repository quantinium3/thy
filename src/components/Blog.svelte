<script lang="ts">
	import { formatDate } from '$lib/utils';
	let { blog } = $props();
</script>

<div class="flex flex-col border-b border-dashed py-9 border-zinc-500/50">
	<div class=" mb-1">
		<h1 class="text-xl font-semibold text-[#fe8019]">
			<a
				href="/blog/{blog.slug}"
				class="hover:underline hover:underline-offset-2 dark:hover:border-b-white"
				>{blog.title}</a
			>
		</h1>
	</div>

	<div class="flex gap-3 mb-5">
		<p class="text-xs text-zinc-900 dark:text-zinc-100 border-r pr-2">{formatDate(blog.date)}</p>
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
