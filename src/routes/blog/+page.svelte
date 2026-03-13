<script lang="ts">
	import Blog from '$components/Blog.svelte';
	let { data } = $props();
</script>

<svelte:head>
	<title>Blog</title>
</svelte:head>

<div class="mt-[3rem] flex">
	<div class="pr-0 md:flex-3/4 md:pr-12">
		{#each data.blogs as blog (blog)}
			<Blog {blog} />
		{/each}
	</div>

	<div class="hidden flex-1/4 px-0 py-9 md:block md:px-3">
		{#each data.blogs as blog (blog.title)}
			<div class="flex">
				<div class="hover:font-semibold hover:underline hover:underline-offset-4">
					-> <a href="/blog/{blog.slug}">{blog.title}</a>
				</div>
			</div>
		{/each}
	</div>
</div>
