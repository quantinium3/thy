<script lang="ts">
	import { AreaChart, PieChart } from 'layerchart';
	import { scaleUtc } from 'd3-scale';
	import { curveLinear } from 'd3-shape';
	import { Container as ChartContainer } from '$lib/components/ui/chart/index.js';
	import type { ChartConfig } from '$lib/components/ui/chart/index.js';

	let {
		chartItems,
		pieItems
	}: {
		chartItems: { date: Date; hours: number }[];
		pieItems: { lang: string; percent: number; color: string }[];
	} = $props();

	const chartConfig: ChartConfig = {
		desktop: { label: 'hours', color: 'var(--color-blue-400)' }
	};

	const pieConfig = $derived<ChartConfig>({
		percent: { label: 'Percent' },
		...Object.fromEntries(
			pieItems.map((item) => [item.lang, { label: item.lang, color: item.color }])
		)
	});
</script>

<div class="flex flex-wrap items-center gap-9 md:flex-nowrap md:gap-0">
	<div class="flex-2/3">
		<ChartContainer config={chartConfig}>
			<AreaChart
				data={chartItems}
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
				data={pieItems}
				key="lang"
				value="percent"
				cRange={pieItems.map((d) => d.color)}
				c="color"
				props={{ pie: { motion: 'tween' } }}
			/>
		</ChartContainer>
	</div>
</div>
