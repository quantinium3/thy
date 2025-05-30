<script lang="ts">
	import { formatDate } from '$lib/utils';
	import * as config from '$lib/config';

	let { data } = $props();
</script>

<svelte:head>
	<title>{config.title}</title>
</svelte:head>

<section class="mx-auto max-w-6xl py-12 px-5 lg:px-48 lg:py-36">
	<div class="text-2xl font-bold lg:text-3xl">Blogs</div>
	<ul class="relative top-2 left-3 list-none">
		{#each data.blogs as blog, index (blog)}
			<li
				class="relative pl-8 {index === data.blogs.length - 1
					? "before:absolute before:left-0 before:content-['└─']"
					: "before:absolute before:left-0 before:content-['├─']"} {index === 0 ||
				index === data.blogs.length - 1
					? 'before:z-10'
					: ''}"
			>
				{#if index === data.blogs.length - 1}
					<div class="bg-text absolute top-0 left-[5px] h-full w-[2px]"></div>
				{/if}
				<div class="flex items-center">
					<a
						class="link-animate text-lg hover:font-semibold hover:text-[#e1e1e1]"
						href="/blogs/{blog.slug}">{blog.title}</a
					><span class="ml-3 font-bold text-gray-500">// {formatDate(blog.date)}</span>
				</div>
			</li>
		{/each}
	</ul>
</section>

<style>
	.link-animate {
		position: relative;
		display: inline-block;
		overflow: hidden;
	}

	.link-animate::after {
		content: '';
		position: absolute;
		left: 0;
		bottom: 0;
		width: 0%;
		height: 2px;
		background-color: #f0f0f0;
		transition: width 0.3s ease;
	}

	.link-animate:hover::after {
		width: 100%;
	}
</style>

