import recommendedData from './media/recommended.json';
import yetToConsumeData from './media/yet-to-consume.json';

export type MediaKind = 'movie' | 'anime' | 'game' | 'show' | 'book';

export type Media = {
	name: string;
	kind: MediaKind;
	image?: string;
	url?: string;
};

export const recommended: Media[] = recommendedData as Media[];
export const yetToConsume: Media[] = yetToConsumeData as Media[];
