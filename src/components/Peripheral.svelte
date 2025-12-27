<script lang="ts">
	import { onMount } from 'svelte';
	const formatter = new Intl.NumberFormat('en', { notation: 'compact', compactDisplay: 'short' });

	let keypress = $state(0);
	let right_click = $state(0);
	let left_click = $state(0);
	let mouse_travel = $state(0);
	let scroll_travel = $state(0);

	onMount(async () => {
		const statsUri = `${import.meta.env.VITE_NIXIE_URI}/api/stats/${import.meta.env.VITE_USERID}`;
		if (!statsUri) {
			throw new Error('Stats URI is missing');
		}

		const statsRes = await fetch(statsUri);
		const statsData = await statsRes.json();

		keypress = statsData.stats.keypress;
		mouse_travel = statsData.stats.mouse_distance;
		scroll_travel = statsData.stats.scroll_distance;
		left_click = statsData.stats.left_click;
		right_click = statsData.stats.right_click;
	});
</script>

<div class="mb-2 text-lg font-bold">Input</div>
<div class="hour">> keypress - {formatter.format(keypress)}</div>
<div class="daily_avg">> mouse travel - {formatter.format(mouse_travel)}m</div>
<div class="daily_avg">> scroll travel - {formatter.format(scroll_travel)}m</div>
<div class="hour">> left click - {formatter.format(left_click)}</div>
<div class="daily_avg">> right click - {formatter.format(right_click)}</div>
