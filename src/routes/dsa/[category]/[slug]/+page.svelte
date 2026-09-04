<script lang="ts">
	import EntryPage from '$lib/components/entry-page.svelte';
	import { resolve } from '$app/paths';
	let { data } = $props();
</script>

<EntryPage
	backHref={resolve(`/dsa/${data.category}`)}
	backLabel="[/dsa/{data.category}]"
	title={data.title}
	date={data.date}
	description={data.description}
	tags={data.tags}
	content={data.content}
>
	{#snippet meta()}
		{#if data.difficulty}
			<span class="text-amber-600 dark:text-amber-400">&lt;{data.difficulty}&gt;</span>
		{/if}
		{#if data.problemUrl}
			<a
				href={data.problemUrl}
				target="_blank"
				rel="noopener noreferrer external"
				class="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
				>[problem]</a
			>
		{/if}
	{/snippet}
</EntryPage>
