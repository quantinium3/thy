export const CELL = 4;

export type CarouselItem =
	{ type: 'image'; src: string; alt: string } | { type: 'clock' | 'gol' | 'badapple' };

export const items: CarouselItem[] = [
	{ type: 'image', src: '/frieren.webp', alt: 'frieren 1' },
	{ type: 'clock' },
	{ type: 'gol' },
	{ type: 'badapple' },
	{ type: 'image', src: '/teto.webp', alt: 'teto' }
];
