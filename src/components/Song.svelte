<script>
	import axios from 'axios';
	import { onMount } from 'svelte';
	import Marquee from 'svelte-fast-marquee';
	import { ExternalLink } from '@lucide/svelte';

	let songName = $state('');
	let songImgUri = $state('');
	let songArtist = $state('');
	let songIsPlaying = $state(false);
    let songUri = $state("");

	onMount(async () => {
		try {
			await axios.get('https://lucy.quantinium.dev/api/lastfm/current').then((res) => {
				const song = res.data.response.track[0];
				songArtist = song.artist['#text'];
				songName = song.name;
				songImgUri = song.image[song.image.length - 1]['#text'];
				songIsPlaying = res.data.response.track[0]['@attr']?.nowplaying == 'true' ? true : false;
                songUri = song.url;
			});
		} catch (err) {
			console.error('failed to fetch current song', err);
			songIsPlaying = false;
		}
	});
</script>
 
<div class="mb-2 text-lg font-bold flex items-center gap-1">Listening: <a href={songUri} target="_blank" class="cursor-pointer"><ExternalLink size={16} /></a></div>

{#if songIsPlaying}
	<div class="ml-1 flex">
		<img src={songImgUri} alt={songName} class="mr-3 w-18" />
		<div class="flex flex-col justify-center">
			<Marquee class="flex gap-2" speed={7}>{songName}</Marquee>
			<Marquee class="text-xs break-all" speed={7}>{songArtist}</Marquee>
		</div>
	</div>
{:else}
	<div>> currently not listening to anything</div>
{/if}
