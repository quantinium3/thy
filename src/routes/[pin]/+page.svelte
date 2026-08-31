<script lang="ts">
	import Home from '$lib/components/home.svelte';

	let { data } = $props();
</script>

<Home {data} pin={data.pin} />
