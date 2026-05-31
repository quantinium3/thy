<script lang="ts">
	import { onMount } from 'svelte';

	const fmt = new Intl.NumberFormat('en', { notation: 'compact', compactDisplay: 'short' });

	let keypress = $state(0);
	let leftClick = $state(0);
	let rightClick = $state(0);
	let mouseTravel = $state(0);
	let scrollTravel = $state(0);
	let loading = $state(true);
	let error = $state(false);

	onMount(async () => {
		try {
			const res = await fetch('https://eris.quantinium.workers.dev/api/stats');
			const data = (await res.json()) as {
				stats: {
					keypress: number;
					left_click: number;
					right_click: number;
					mouse_distance: number;
					scroll_distance: number;
				};
			};
			keypress = data.stats.keypress;
			leftClick = data.stats.left_click;
			rightClick = data.stats.right_click;
			mouseTravel = data.stats.mouse_distance;
			scrollTravel = data.stats.scroll_distance;
		} catch (err) {
			console.error('failed to fetch input stats', err);
			error = true;
		} finally {
			loading = false;
		}
	});
</script>

<div class="mt-3">
	<span class="block pb-1 font-bold">Input</span>
	<div class="space-y-0.5 text-sm">
		<div>
			<span class="opacity-70">*</span> keypress - {loading
				? '...'
				: error
					? 'n/a'
					: fmt.format(keypress)}
		</div>
		<div>
			<span class="opacity-70">*</span> mouse travel - {loading
				? '...'
				: error
					? 'n/a'
					: `${fmt.format(mouseTravel)}m`}
		</div>
		<div>
			<span class="opacity-70">*</span> scroll travel - {loading
				? '...'
				: error
					? 'n/a'
					: `${fmt.format(scrollTravel)}m`}
		</div>
		<div>
			<span class="opacity-70">*</span> left click - {loading
				? '...'
				: error
					? 'n/a'
					: fmt.format(leftClick)}
		</div>
		<div>
			<span class="opacity-70">*</span> right click - {loading
				? '...'
				: error
					? 'n/a'
					: fmt.format(rightClick)}
		</div>
	</div>
</div>
