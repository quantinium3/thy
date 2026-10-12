import type { CarouselItem } from '$lib/carousel';

/**
 * url slug -> the screens shown on `/<slug>`.
 *
 * server-only on purpose: nothing in here reaches the client bundle, so these
 * screens are invisible on `/` and every other normal route. only the pin for
 * the url actually being visited is sent down.
 */
const pins: Record<string, CarouselItem[]> = {
	harsha: [
		{ type: 'image', src: '/harsha.webp', alt: 'harsha 1' },
		{ type: 'image', src: '/harsha-2.webp', alt: 'harsha 2' },
		{ type: 'image', src: '/harsha-3.webp', alt: 'harsha 3' }
	],
	nam: [{ type: 'image', src: '/nam.webp', alt: 'nam' }]
};

export const getPin = (slug: string): CarouselItem[] | undefined => pins[slug];
