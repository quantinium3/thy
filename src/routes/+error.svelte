<script lang="ts">
	import { page } from '$app/state';
	import { onMount } from 'svelte';
	import Seo from '$lib/components/seo.svelte';

	onMount(() => {
		const script = document.createElement('script');
		script.src = '/dino/dino.js';
		document.head.appendChild(script);
		return () => script.remove();
	});
</script>

<Seo title={`${page.status}`} description={page.error?.message ?? 'something went wrong'} />

<div class="py-4">
	<p class="font-bold">{page.status}</p>
	<p class="mt-1">{page.error?.message ?? 'something went wrong'}</p>
	<div class="mt-6 overflow-hidden rounded border dark:border-zinc-600">
		<div data-dino-game data-asset-path="/dino" data-font-path="/Menlo-Regular.ttf"></div>
	</div>
	<p class="mt-2 text-xs opacity-40">press space to play</p>
</div>
