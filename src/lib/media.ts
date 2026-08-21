import recommendedData from './media/recommended.json';
import yetToConsumeData from './media/yet-to-consume.json';

export type MediaKind = 'movie' | 'anime' | 'game' | 'show' | 'book' | 'manga' | 'manhwa';

export type MediaCategory = 'watch' | 'play' | 'read';

export type Media = {
	name: string;
	kind: MediaKind;
	image?: string;
	url?: string;
};

export const kindCategory: Record<MediaKind, MediaCategory> = {
	movie: 'watch',
	anime: 'watch',
	show: 'watch',
	game: 'play',
	book: 'read',
	manga: 'read',
	manhwa: 'read'
};

export const recommended: Media[] = recommendedData as Media[];
export const yetToConsume: Media[] = yetToConsumeData as Media[];
