<script lang="ts">
	import type { LineData } from '$lib/types';
	import { onMount } from 'svelte';
    let totalTime = $state(0);

	onMount(async () => {
		try {
			const timeUri = import.meta.env.VITE_TIME_URI;
			if (!timeUri) {
				throw new Error('Time URI is missing');
			}

			const timeRes = await fetch(timeUri);
			const timeData = await timeRes.json();
			const timeValues: string[] = timeData.data.map((label: LineData) =>
				parseFloat(label.grand_total.decimal)
			);
			totalTime = timeValues.reduce((acc, curr) => acc + parseFloat(curr), 0);
		} catch (error) {
			console.error('Error fetching data:', error);
		}
	});
</script>

<div class="mb-2 text-lg font-bold">Stats (weekly)</div>
<div class="hour">> total - {totalTime.toFixed(2)} hr</div>
<div class="daily_avg">> daily avg - {(totalTime / 7).toFixed(2)} hr</div>
<div class="hour">> editor - neovim</div>
<div class="daily_avg">> os - nixos</div>
<div class="daily_avg">> current - dampe</div>
