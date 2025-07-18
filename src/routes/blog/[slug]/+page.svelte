<script lang="ts">
	import { formatDate } from '$lib/utils';
	import { ArrowLeft, Copyright, Github, Mail, Rss, Twitter } from '@lucide/svelte';
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

<article class="mt-[4rem] flex flex-col gap-5 dark:text-white">
		<a href="/blog" class="flex items-center hover:underline hover:underline-offset-2"><ArrowLeft class="h-[15px]" /> back </a>
	<hgroup class="t mb-2 flex flex-col">
		<h1 class="heading mb-1 text-xl font-semibold">{data.meta.title}</h1>
		<div class="flex gap-3">
			<p class="dark:text-zinc-400 text-[11px] md:text-[14px]">
				published: {formatDate(data.meta.date)}
			</p>
			|
			<div class="flex gap-3 text-[11px] md:text-[14px]">
				{#each data.meta.categories as category (category)}
					<a href="#" class="">#{category}</a>
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

<footer class="flex justify-between border-t mt-5 py-3 border-[#3f3f3f]">
<div class="">
	<Copyright class="inline" size={15} />quantinium
	{new Date().getFullYear()}
</div>
<div class="flex gap-3">
	<a href="https://github.com/quantinium3" target="_blank"><Github /></a>
	<a href="https://x.com/quantinium3" target="_blank"><Twitter /></a>
	<a href="mailto:quant@quantinium.dev" target="_blank"><Mail /></a>
	<a href="/rss-xml" target="_blank"><Rss /></a>
</div>
</footer>

<style>
	.heading {
		text-transform: capitalize;
	}
</style>
