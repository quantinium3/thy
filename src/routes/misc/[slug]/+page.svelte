<script lang="ts">
	import EntryPage from '$lib/components/entry-page.svelte';
	import { resolve } from '$app/paths';
	let { data } = $props();
</script>

<EntryPage
	backHref={resolve('/misc')}
	backLabel="[/misc]"
	title={data.title}
	date={data.date}
	description={data.description}
	tags={data.tags}
	content={data.content}
/>
