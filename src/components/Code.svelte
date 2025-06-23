<script lang="ts">
	import { AreaChart, PieChart } from 'layerchart';
	import { curveLinear } from 'd3-shape';
	import { scaleUtc } from 'd3-scale';
	import * as Chart from '$lib/components/ui/chart/index.js';
	import { onMount } from 'svelte';

	// Chart data (unchanged)
	const chart = $state({
		items: [
			{ date: new Date('2025-06-10'), hours: 0 },
			{ date: new Date('2025-06-11'), hours: 0 },
			{ date: new Date('2025-06-12'), hours: 0 },
			{ date: new Date('2025-06-13'), hours: 0 },
			{ date: new Date('2025-06-14'), hours: 0 },
			{ date: new Date('2025-06-15'), hours: 0 }
		]
	});

	// Pie data
	const pie = $state({
		items: [
			{ lang: 'Loading...', percent: 100, color: '#dea584' }
		]
	});

	onMount(async () => {
		try {
			const timeUri = import.meta.env.VITE_TIME_URI;
			const timeRes = await fetch(timeUri);
			if (!timeRes.ok) {
				console.log('Failed to fetch time data');
			}
			const timeData = await timeRes.json();
			chart.items = timeData.data.map(entry => ({
				date: new Date(entry.range.date),
				hours: parseFloat(entry.grand_total?.decimal) || 0
			}));

			const langUri = import.meta.env.VITE_LANG_URI;
			const langRes = await fetch(langUri);
			if (!langRes.ok) {
				console.error('Failed to fetch language data');
			}
			const langData = await langRes.json();
			pie.items = langData.data.map(entry => ({
				lang: entry.name.toLowerCase(),
				percent: entry.percent,
				color: entry.color
			}));
		} catch (error) {
			console.error('Error fetching data:', error);
		}
	});

	const pieConf = $derived(() => {
		const config: Record<string, { label: string; color: string }> = {
			percent: { label: 'Percent', color: '' }
		};
		pie.items.forEach(item => {
			const key = item.lang;
			config[key] = {
				label: item.lang,
				color: item.color
			};
		});
		return config;
	});

	const pieConfig = $derived({
		percent: { label: 'Percent' },
		...pieConf()
	} satisfies Chart.ChartConfig);

	const chartConfig = {
		desktop: { label: 'hours', color: 'var(--chart-1)' }
	} satisfies Chart.ChartConfig;

</script>

<div class="my-3 font-bold text-xl">Charts</div>
<div class="flex">
	<div class="flex-2/3">
		<Chart.Container config={chartConfig}>
			<AreaChart
				data={chart.items}
				x="date"
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
					yAxis: { format: (v) => v }
				}}
			>
				{#snippet tooltip()}
					<Chart.Tooltip hideLabel />
				{/snippet}
			</AreaChart>
		</Chart.Container>
	</div>
	<div class="flex-1/2">
		<Chart.Container config={pieConfig}
										 class="mx-auto aspect-square max-h-[200px]">
			<PieChart
				data={pie.items}
				key="lang"
				value="percent"
				cRange={pie.items.map((d) => d.color)}
				c="color"
				props={{
					pie: {
						motion: 'tween'
					}
				}}
			>
				{#snippet tooltip()}
					<Chart.Tooltip hideLabel />
				{/snippet}
			</PieChart>
		</Chart.Container>
	</div>
</div>
