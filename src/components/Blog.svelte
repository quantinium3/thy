<script lang="ts">
	import { formatDate } from '$lib/utils';
	let { blog } = $props();
</script>

<div class="py-8 border-t border-dashed flex flex-col gap-5">
	<div>
		<h1 class="font-semibold"><a href={blog.slug}>{blog.title}</a></h1>
		<p class="">published date: {formatDate(blog.date)}</p>
	</div>
	<div class="flex gap-3">
		{#each blog.categories as category (category)}
			<span class="hover:bg-blue-400">#{category}</span>
		{/each}
	</div>

	<div class="">{blog.description}</div>
	<div><a href="/blog/{blog.slug}" class="hover:underline underline-offset-2">read more...</a></div>
</div>
