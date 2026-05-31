<script lang="ts">
	import { page } from '$app/state';
	import { onMount } from 'svelte';
	import { resolve } from '$app/paths';

	onMount(() => {
		const script = document.createElement('script');
		script.src = '/dino/dino.js';
		document.head.appendChild(script);
		return () => script.remove();
	});
</script>

<div class="py-4">
	<p class="text-4xl font-bold opacity-30">{page.status}</p>
	<p class="mt-1 text-sm opacity-60">{page.error?.message ?? 'something went wrong'}</p>
	<a
		href={resolve('/')}
		class="mt-3 inline-block text-sm text-blue-600 hover:underline dark:text-blue-400">[/]</a
	>

	<div class="mt-6 overflow-hidden rounded border dark:border-zinc-600">
		<div data-dino-game data-asset-path="/dino" data-font-path="/Menlo-Regular.ttf"></div>
	</div>
	<p class="mt-2 text-xs opacity-40">press space to play</p>
</div>
