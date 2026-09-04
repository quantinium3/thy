<script lang="ts">
	import Seo from '$lib/components/seo.svelte';
	import SolutionList from '$lib/components/solution-list.svelte';
	let { data } = $props();
</script>

<Seo
	title="DSA / {data.category}"
	description="Solutions and write-ups by quantinium for {data.category} problems."
/>

<SolutionList solutions={data.solutions} categories={data.categories} active={data.category} />
