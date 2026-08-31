export type CarouselItem =
	| { type: 'image'; src: string; alt: string }
	| { type: 'clock' | 'gol' | 'badapple' };

/** the default rotation shown on every normal route */
export const items: CarouselItem[] = [
	{ type: 'image', src: '/frieren.jpg', alt: 'frieren 1' },
	{ type: 'clock' },
	{ type: 'gol' },
	{ type: 'badapple' },
	{ type: 'image', src: '/teto.png', alt: 'teto' }
];
