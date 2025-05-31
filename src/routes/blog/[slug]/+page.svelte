<script lang="ts">
	import { formatDate } from '$lib/utils';
	let { data } = $props();
</script>

<svelte:head>
	<title>{data.meta.title}</title>
	<meta property="og:type" content="article" />
	<meta property="og:title" content={data.meta.title} />
	<link
		rel="stylesheet"
		href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.30.0/themes/prism-tomorrow.min.css"
		integrity="sha512-vswe+cgvic/XBoF1OcM/TeJ2FW0OofqAVdCZiEYkd6dwGXthvkSFWOoGGJgS2CW70VK5dQM5Oh+7ne47s74VTg=="
		crossorigin="anonymous"
		referrerpolicy="no-referrer"
	/>
</svelte:head>

<article class="flex flex-col gap-5 lg:mt-24 dark:text-white">
	<hgroup class="t flex flex-col">
		<h1 class="text-2xl font-semibold">{data.meta.title}</h1>
		<div class="flex gap-3">
			<p class="dark:text-zinc-400 border-r-2 border-white pr-3">published: {formatDate(data.meta.date)}</p>
			<div class="flex gap-3">
				{#each data.meta.categories as category (category)}
					<a href="#" class="hover:dark:bg-blue-500 hover:dark:text-white">#{category}</a>
				{/each}
			</div>
		</div>
	</hgroup>

	<div class="content">
		<data.content />
	</div>
	<script
		src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.30.0/components/prism-core.min.js"
		integrity="sha512-Uw06iFFf9hwoN77+kPl/1DZL66tKsvZg6EWm7n6QxInyptVuycfrO52hATXDRozk7KWeXnrSueiglILct8IkkA=="
		crossorigin="anonymous"
		referrerpolicy="no-referrer"
	></script>
	<script
		src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.30.0/plugins/autoloader/prism-autoloader.min.js"
		integrity="sha512-SkmBfuA2hqjzEVpmnMt/LINrjop3GKWqsuLSSB3e7iBmYK7JuWw4ldmmxwD9mdm2IRTTi0OxSAfEGvgEi0i2Kw=="
		crossorigin="anonymous"
		referrerpolicy="no-referrer"
	></script>
</article>

<style>
	.content h1,
	h2,
	h3,
	h4,
	h5,
	h6 {
		font-weight: 600;
		margin: 1rem 0;
	}

	.content h1 {
		font-size: 2rem;
	}

	.content h2 {
		font-size: 1.75rem;
	}
	.content h3 {
		font-size: 1.5rem;
	}

	.content p {
		padding: 0.25rem 0;
	}
</style>
