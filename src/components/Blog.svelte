<script lang="ts">
	import { formatDate } from '$lib/utils';
	let { blog } = $props();
</script>

<div class="py-8 border-t border-dashed flex flex-col gap-5">
	<div>
		<h1 class="font-semibold text-3xl"><a href={blog.slug}>{blog.title}</a></h1>
		<p class="text-[16px]">published date: {formatDate(blog.date)}</p>
	</div>
	<div class="flex gap-3 text-sm">
		{#each blog.categories as category (category)}
			<span class="hover:bg-blue-400">#{category}</span>
		{/each}
	</div>

	<div class="text-lg">{blog.description}</div>
	<div><a href="/blog/{blog.slug}" class="hover:underline underline-offset-2">read more...</a></div>
</div>
