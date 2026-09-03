<script lang="ts">
	import { onMount } from 'svelte';
	import { fetchJson } from '$lib/fetch-json';
	import type { Component } from 'svelte';

	type ChartItem = { date: Date; hours: number };
	type PieItem = { lang: string; percent: number; color: string };

	const chart = $state({ items: [] as ChartItem[] });
	const pie = $state({ items: [] as PieItem[] });

	let error = $state(false);

	let Charts = $state<Component<{ chartItems: ChartItem[]; pieItems: PieItem[] }> | null>(null);

	onMount(async () => {
		try {
			const [timeJson, langJson, mod] = await Promise.all([
				fetchJson<{
					data: Array<{ range: { date: string }; grand_total: { decimal: string } }>;
				}>(import.meta.env.VITE_TIME_URI),
				fetchJson<{ data: Array<{ name: string; percent: number; color: string }> }>(
					import.meta.env.VITE_LANG_URI
				),
				import('./wakatime-charts-inner.svelte')
			]);

			chart.items = timeJson.data.map(
				(entry: { range: { date: string }; grand_total: { decimal: string } }) => ({
					date: new Date(entry.range.date),
					hours: parseFloat(entry.grand_total.decimal) || 0
				})
			);

			pie.items = langJson.data.map((entry: { name: string; percent: number; color: string }) => ({
				lang: entry.name.toLowerCase(),
				percent: entry.percent,
				color: entry.color
			}));

			Charts = mod.default;
		} catch (err) {
			console.error('failed to fetch wakatime charts', err);
			error = true;
		}
	});
</script>

<div class="border-b py-3 pl-1 dark:border-zinc-400">
	<h1 class="pb-3 font-bold">Wakatime Stats</h1>

	{#if error}
		<span class="text-xs opacity-50">unavailable</span>
	{:else if Charts}
		<Charts chartItems={chart.items} pieItems={pie.items} />
	{:else}
		<div class="flex flex-wrap items-center gap-9 md:flex-nowrap md:gap-0" aria-hidden="true">
			<div class="flex-2/3"><div class="aspect-video"></div></div>
			<div class="flex-1/2"><div class="mx-auto aspect-square max-h-[200px]"></div></div>
		</div>
	{/if}
</div>
