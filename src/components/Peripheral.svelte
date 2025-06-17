<script lang="ts">
	import { onMount } from 'svelte';
	const formatter = new Intl.NumberFormat('en', {notation: "compact",
		compactDisplay: "short"})

	let keypress = $state(0);
	let right_click = $state(0);
	let left_click = $state(0);
	let mouse_travel = $state(0);


	onMount(async() => {
		const keyUri = import.meta.env.VITE_KEYPRESS_URI;
		if (!keyUri) {
			throw new Error('Keyboard URI is missing');
		}
		const mouseUri = import.meta.env.VITE_MOUSE_STATS_URI;
		if (!mouseUri) {
			throw new Error('Mouse URI is missing');
		}

		const keyRes = await fetch(keyUri);
		const keyData = await keyRes.json();

		const mouseRes = await fetch(mouseUri);
		const mouseData = await mouseRes.json();

		keypress = keyData.data.keypress;
		mouse_travel = mouseData.data.mouseTravel;
		left_click = mouseData.data.leftClick;
		right_click = mouseData.data.rightClick;
	})

</script>
<div class="text-lg font-bold mb-2">Input</div>
<div class="hour"> > keypress - {formatter.format(keypress)}</div>
<div class="daily_avg"> > mouse travel - {formatter.format(mouse_travel)} m</div>
<div class="hour"> > left click - {formatter.format(left_click)}</div>
<div class="daily_avg"> > right click - {formatter.format(right_click)}</div>


