<script lang="ts">
	import type { Snippet } from 'svelte';
	import { fly } from 'svelte/transition';

	type Props = {
		children: Snippet;
		url: string;
	};

	let { children, url }: Props = $props();
</script>

{#key url}
	<div class="transition" in:fly={{y: 50, duration: 1000}}>
		{@render children?.()}
	</div>
{/key}

<style>
	.transition {
		height: 100%;
	}
</style>
