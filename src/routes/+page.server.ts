import type { Blog, ChartDataSet, Dataset, LineData } from '$lib/types';
import {VITE_LANG_URI, VITE_TIME_URI, VITE_KEYPRESS_URI, VITE_MOUSE_STATS_URI} from '$env/static/private';

const SEED: number = 16777215;
const FACTOR: number = 123456789;
const TEXT_WEIGHT: number = 0.3;
const MIXED_WEIGHT: number = 0.7;

const COLOR_MAP: { [key: string]: string } = {
	'red': '#FF0000', 'green': '#008000', 'blue': '#0000FF', 'yellow': '#FFFF00',
	'orange': '#FFA500', 'purple': '#800080', 'pink': '#FFC0CB', 'brown': '#A52A2A',
	'black': '#000000', 'white': '#FFFFFF', 'gray': '#808080', 'grey': '#808080',
	'cyan': '#00FFFF', 'magenta': '#FF00FF', 'lime': '#00FF00', 'maroon': '#800000',
	'navy': '#000080', 'olive': '#808000', 'teal': '#008080', 'silver': '#C0C0C0',
	'gold': '#FFD700', 'violet': '#EE82EE', 'indigo': '#4B0082', 'coral': '#FF7F50',
	'salmon': '#FA8072', 'khaki': '#F0E68C', 'plum': '#DDA0DD', 'tan': '#D2B48C'
};

function _words(text: string): string[] {
	return text.toLowerCase().match(/\b\w+\b/g) || [];
}

function toHex(word: string): string | null {
	return COLOR_MAP[word.toLowerCase()] || null;
}

interface RgbObject {
	r: number;
	g: number;
	b: number;
}

function hexRgb(hex: string, options: { format?: 'array' } = {}): number[] | RgbObject {
	hex = hex.replace('#', '');

	if (hex.length === 3) {
		hex = hex.split('').map(char => char + char).join('');
	}

	const r = parseInt(hex.substring(0, 2), 16);
	const g = parseInt(hex.substring(2, 4), 16);
	const b = parseInt(hex.substring(4, 6), 16);

	if (options.format === 'array') {
		return [r, g, b];
	}

	return { r, g, b };
}

function rgbHex(r: number, g: number, b: number): string {
	const toHex = (value: number): string => {
		const hex = Math.round(Math.max(0, Math.min(255, value))).toString(16);
		return hex.length === 1 ? '0' + hex : hex;
	};

	return '#' + toHex(r) + toHex(g) + toHex(b);
}

function trimStart(str: string, chars?: string): string {
	if (!chars) return str.trimStart();

	let start = 0;
	while (start < str.length && chars.includes(str[start])) {
		start++;
	}
	return str.substring(start);
}

function padEnd(str: string, length: number, padString: string = ' '): string {
	if (str.length >= length) return str;

	const padLength = length - str.length;
	const pad = padString.repeat(Math.ceil(padLength / padString.length));
	return str + pad.substring(0, padLength);
}

function getColors(text: string): number[][] {
	const words: string[] = _words(text);
	const colors: number[][] = [];
	words.forEach((word: string) => {
		const color = toHex(word);
		if (color) {
			const rgb = hexRgb(trimStart(color, '#'), { format: 'array' }) as number[];
			colors.push(rgb);
		}
	});
	return colors;
}

function mixColors(colors: number[][]): number[] {
	const mixed: number[] = [0, 0, 0];
	colors.forEach((value: number[]) => {
		for (let i = 0; i < 3; i++) {
			mixed[i] += value[i];
		}
	});
	return [
		mixed[0] / colors.length,
		mixed[1] / colors.length,
		mixed[2] / colors.length
	];
}

function generateColor(text: string): string {
	let mixed: number[] | undefined;
	const colors: number[][] = getColors(text);
	if (colors.length > 0) mixed = mixColors(colors);

	let b: number = 1;
	let d: number = 0;
	let f: number = 1;

	if (text.length > 0) {
		for (let i = 0; i < text.length; i++) {
			if (text[i].charCodeAt(0) > d) {
				d = text[i].charCodeAt(0);
			}
			f = Math.floor(SEED / d);
			b = (b + text[i].charCodeAt(0) * f * FACTOR) % SEED;
		}
	}

	let hex: string = ((b * text.length) % SEED).toString(16);
	hex = padEnd(hex, 6, hex);
	const rgb: number[] = hexRgb(hex, { format: 'array' }) as number[];

	if (mixed) {
		return rgbHex(
			TEXT_WEIGHT * rgb[0] + MIXED_WEIGHT * mixed[0],
			TEXT_WEIGHT * rgb[1] + MIXED_WEIGHT * mixed[1],
			TEXT_WEIGHT * rgb[2] + MIXED_WEIGHT * mixed[2]
		);
	}

	return '#' + hex;
}

export async function load({ fetch }) {
	const res = await fetch('/api/blog');
	const blogs: Blog[] = await res.json();

	const langUri = VITE_LANG_URI;
	if (!langUri) {
		throw new Error('Language URI is missing');
	}

	const langRes = await fetch(langUri);
	const langData = await langRes.json();

	const timeUri = VITE_TIME_URI;
	if (!timeUri) {
		throw new Error('Time URI is missing');
	}

	const timeRes = await fetch(timeUri);
	const timeData = await timeRes.json();

	const langLabels: string[] = langData.data.slice(1).map((label: ChartDataSet) => label.name);
	const langPercentage: number[] = langData.data
		.slice(1)
		.map((label: ChartDataSet) => label.percent);

	const timeValues: string[] = timeData.data.map((label: LineData) =>
		parseFloat(label.grand_total.decimal)
	);
	const timeLabels: number[] = timeData.data.map((label: LineData) => label.range.text.slice(0, 3));
	const totalTime = timeValues.reduce((acc, curr) => acc + parseFloat(curr), 0);

	const pieData: Dataset = {
		labels: langLabels,
		datasets: [
			{
				label: 'Coding stats',
				data: langPercentage,
				backgroundColor: langLabels.map((label: string) => generateColor(label.toLowerCase())),
				borderColor: langLabels.map(() => 'rgba(235, 219, 178, 0.5)'), // 50% opacity
				hoverOffset: 4
			}
		]
	};

	const pieOptions = {
		plugins: {
			title: {
				display: true,
				text: 'Languages',
				color: '#ebdbb2'
			},
			legend: {
				display: false
			},
			tooltip: {
				enabled: true
			}
		},
		layout: {
			padding: 20
		}
	};

	const lineChartData = {
		labels: timeLabels,
		datasets: [
			{
				label: 'Time Spent (Hours)',
				data: timeValues,
				borderColor: 'rgba(215, 153, 33, 0.5)', // 50% opacity
				backgroundColor: 'rgba(215, 153, 33, 0.2)',
				tension: 0.3,
				pointStyle: 'star',
				pointRadius: 5,
				pointHoverRadius: 8
			}
		]
	};

	const lineOptions = {
		plugins: {
			title: {
				display: true,
				text: 'Time Spent Per Day',
				color: '#ebdbb2'
			},
			legend: {
				display: false
			}
		},
		responsive: true,
		scales: {
			y: {
				grid: {
					color: '#504945'
				},
				ticks: {
					color: '#ebdbb2'
				},
				beginAtZero: true,
				title: {
					display: true,
					text: 'Hours',
					color: '#ebdbb2'
				}
			},
			x: {
				grid: {
					color: '#504945'
				},
				ticks: {
					color: '#ebdbb2'
				},
				title: {
					display: true,
					text: 'Days',
					color: '#ebdbb2'
				}
			}
		}
	};

	return {
		blogs,
		pieData,
		pieOptions,
		lineOptions,
		lineChartData,
		totalTime,
	};
}