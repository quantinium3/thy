<script>
	import axios from 'axios';
	import { onMount } from 'svelte';
	import Marquee from 'svelte-fast-marquee';
	import { ExternalLink } from '@lucide/svelte';

	let songName = $state('');
	let songImgUri = $state('');
	let songArtist = $state('');
	let songUri = $state('');

	onMount(async () => {
		try {
			await axios.get(`https://eris.quantinium.workers.dev/api/lastfm`).then((res) => {
				const song = res.data.songs.track[0];
				songArtist = song.artist['#text'];
				songName = song.name;
				songImgUri = song.image[song.image.length - 1]['#text'];
				songUri = song.url;
			});
		} catch (err) {
			console.error('failed to fetch current song', err);
		}
	});
</script>

<div class="mb-2 flex items-center gap-1 text-lg font-bold">
	Listening: <a href={songUri} target="_blank" class="cursor-pointer"><ExternalLink size={16} /></a>
</div>

<div class="ml-1 flex">
	<img src={songImgUri} alt={songName} class="mr-3 w-18" />
	<div class="flex flex-col justify-center">
		<Marquee class="flex gap-2" speed={7}>{songName}</Marquee>
		<Marquee class="text-xs break-all" speed={7}>{songArtist}</Marquee>
	</div>
</div>
