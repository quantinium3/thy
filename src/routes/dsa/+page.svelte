<script lang="ts">
	import Seo from '$lib/components/seo.svelte';
	import SolutionList from '$lib/components/solution-list.svelte';
	let { data } = $props();
</script>

<Seo
	title="DSA"
	description="Solutions and write-ups by quantinium for problems from leetcode, codeforces, atcoder and other judges."
/>

<SolutionList solutions={data.solutions} categories={data.categories} />
