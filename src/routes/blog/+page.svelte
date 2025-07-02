<script lang="ts">
	import Blog from '$components/Blog.svelte';
	let { data } = $props();
</script>

<svelte:head>
	<title>Blog</title>
</svelte:head>

<div class="flex mt-[3rem]">
	<div class="md:flex-3/4 pr-0 md:pr-12">
		{#each data.blogs as blog (blog)}
			<Blog blog={blog}/>
		{/each}
	</div>

	<div class="py-9 px-0 md:px-3 flex-1/4 hidden md:block">
		{#each data.blogs as blog (blog.title)}
			<div class="flex">
				<div class="hover:underline hover:underline-offset-4 hover:font-semibold" >
					-> <a href="/blog/{blog.slug}">{blog.title}</a>
				</div>
			</div>
		{/each}
	</div>
</div>
