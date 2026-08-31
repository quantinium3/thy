import type { CarouselItem } from '$lib/carousel';

/**
 * url slug -> the single screen shown on `/<slug>`.
 *
 * server-only on purpose: nothing in here reaches the client bundle, so these
 * screens are invisible on `/` and every other normal route. only the pin for
 * the url actually being visited is sent down.
 */
const pins: Record<string, CarouselItem> = {
	harsha: { type: 'image', src: '/harsha.png', alt: 'harsha' }
};

export const getPin = (slug: string): CarouselItem | undefined => pins[slug];
