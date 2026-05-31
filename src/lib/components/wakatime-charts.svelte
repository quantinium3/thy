<script lang="ts">
	import { onMount } from 'svelte';
	import { AreaChart, PieChart } from 'layerchart';
	import { scaleUtc } from 'd3-scale';
	import { curveLinear } from 'd3-shape';
	import { Container as ChartContainer } from '$lib/components/ui/chart/index.js';
	import type { ChartConfig } from '$lib/components/ui/chart/index.js';

	const chart = $state({
		items: [] as { date: Date; hours: number }[]
	});

	const pie = $state({
		items: [] as { lang: string; percent: number; color: string }[]
	});

	const chartConfig: ChartConfig = {
		desktop: { label: 'hours', color: 'var(--color-blue-400)' }
	};

	const pieConfig = $derived<ChartConfig>({
		percent: { label: 'Percent' },
		...Object.fromEntries(
			pie.items.map((item) => [item.lang, { label: item.lang, color: item.color }])
		)
	});

	let error = $state(false);

	onMount(async () => {
		try {
			const [timeRes, langRes] = await Promise.all([
				fetch(import.meta.env.VITE_TIME_URI),
				fetch(import.meta.env.VITE_LANG_URI)
			]);

			const timeJson = (await timeRes.json()) as {
				data: Array<{ range: { date: string }; grand_total: { decimal: string } }>;
			};
			const langJson = (await langRes.json()) as {
				data: Array<{ name: string; percent: number; color: string }>;
			};

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
		} catch (err) {
			console.error('failed to fetch wakatime charts', err);
			error = true;
		}
	});
</script>

<div class="border-b py-3 dark:border-zinc-400 pl-1">
	<h1 class="pb-3 font-bold">Wakatime Stats</h1>

	{#if error}
		<span class="text-xs opacity-50">unavailable</span>
	{:else}
		<div class="flex flex-wrap items-center gap-9 md:flex-nowrap md:gap-0">
			<div class="flex-2/3">
				<ChartContainer config={chartConfig}>
					<AreaChart
						data={chart.items}
						x="date"
						y="hours"
						xScale={scaleUtc()}
						series={[{ key: 'hours', label: 'hours', color: chartConfig.desktop.color }]}
						seriesLayout="stack"
						props={{
							area: {
								curve: curveLinear,
								'fill-opacity': 0.4,
								line: { class: 'stroke-1' },
								motion: 'tween'
							},
							xAxis: {
								format: (v: Date) => v.toLocaleDateString('en-US', { weekday: 'short' })
							},
							yAxis: { format: (v: number) => `${v}` }
						}}
					/>
				</ChartContainer>
			</div>
			<div class="flex-1/2">
				<ChartContainer config={pieConfig} class="mx-auto aspect-square max-h-[200px]">
					<PieChart
						data={pie.items}
						key="lang"
						value="percent"
						cRange={pie.items.map((d) => d.color)}
						c="color"
						props={{ pie: { motion: 'tween' } }}
					/>
				</ChartContainer>
			</div>
		</div>
	{/if}
</div>
