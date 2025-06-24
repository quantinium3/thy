<script lang="ts">
	import { formatDate } from '$lib/utils';
	let { blog } = $props();
</script>

<div class="flex flex-col border-b border-dashed py-9 border-zinc-500/50">
	<div class=" mb-1">
		<h1 class="text-xl font-semibold text-[#fe8019]">
			<a
				href="/blog/{blog.slug}"
				class="link-animate dark:hover:border-b-white"
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

<style>
	.link-animate {
		position: relative;
		text-decoration: none;
		padding-bottom: 3px;
	}

	.link-animate:hover {
		right: 0;
		text-decoration: none;
	}

	.link-animate:hover:after {
		right: 0;
	}

	.link-animate:after {
		border-radius: 1em;
		border-top: 0.1em solid;
		content: '';
		position: absolute;
		right: 100%;
		bottom: 0.14em;
		left: 0;
		transition:
			right 0.4s cubic-bezier(0, 0.5, 0, 1),
			border-color 0.4s ease-out;
	}

	.link-animate:hover:after {
		right: 0;
	}
</style>

