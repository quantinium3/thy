export type MediaKind = 'movie' | 'anime' | 'game' | 'show' | 'book';

export type Media = {
	name: string;
	kind: MediaKind;
	image?: string;
	url?: string;
};

export const media: Media[] = [
	{
		name: "Frieren: Beyond Journey's End",
		kind: 'anime',
		image: 'https://cdn.myanimelist.net/images/anime/1015/138006.jpg'
	},
	{
		name: 'Violet Evergarden',
		kind: 'anime',
		image: 'https://cdn.myanimelist.net/images/anime/1795/95088.jpg'
	},
	{
		name: 'Evangelion: 3.0+1.0 Thrice Upon a Time',
		kind: 'movie',
		image: 'https://cdn.myanimelist.net/images/anime/1422/113533.jpg'
	}
];
