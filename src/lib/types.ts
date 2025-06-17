export type Categories = 'sveltekit' | 'svelte';

export type Blog = {
    title: string
    slug: string
    description: string
    date: string
    categories: Categories[]
    published: boolean
}

export type ChartDataSet = {
	name: string
	percent: number
	color: string
}

export type Dataset = {
	labels: string[];
	datasets: {
		label: string;
		data: number[];
		backgroundColor: string[];
		borderColor: string[],
		hoverOffset: number;
	}[];
}

export type LineData = {
	grand_total: {
		decimal: string;
		digital: string;
		hours: number;
		minutes: number;
		text: string;
		total_seconds: number;
	};
	range: {
		date: string;
		end: string;
		start: string;
		text: string;
		timezone: string;
	};
}