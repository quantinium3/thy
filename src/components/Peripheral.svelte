<script lang="ts">
	import { onMount } from 'svelte';
	const formatter = new Intl.NumberFormat('en', {notation: "compact",
		compactDisplay: "short"})

	let keypress = $state(0);
	let right_click = $state(0);
	let left_click = $state(0);
	let mouse_travel = $state(0);


	onMount(async() => {
		const statsUri = import.meta.env.VITE_STATS_URI;
		if (!statsUri) {
			throw new Error('Stats URI is missing');
		}

		const statsRes = await fetch(statsUri);
		const statsData = await statsRes.json();

		keypress = statsData.stats[0].keypress;
		mouse_travel = statsData.stats[0].mouse_travel;
		left_click = statsData.stats[0].left_click;
		right_click = statsData.stats[0].right_click;
	})

</script>
<div class="text-lg font-bold mb-2">Input</div>
<div class="hour"> > keypress - {formatter.format(keypress)}</div>
<div class="daily_avg"> > mouse travel - {formatter.format(mouse_travel)} m</div>
<div class="hour"> > left click - {formatter.format(left_click)}</div>
<div class="daily_avg"> > right click - {formatter.format(right_click)}</div>
