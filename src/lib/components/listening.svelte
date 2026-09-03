<script lang="ts">
	import ExternalLink from '@lucide/svelte/icons/external-link';
	import { onMount } from 'svelte';
	import { fetchJson } from '$lib/fetch-json';

	let songName = $state('');
	let songArtist = $state('');
	let songImgUri = $state('');
	let songUri = $state('');
	let loading = $state(true);
	let error = $state(false);

	let songNameWidth = $state(0);
	let songArtistWidth = $state(0);
	const pxPerSecond = 40;

	onMount(async () => {
		try {
			const data = await fetchJson<{
				songs: {
					track: Array<{
						name: string;
						artist: { '#text': string };
						image: Array<{ '#text': string }>;
						url: string;
					}>;
				};
			}>('https://eris.quantinium.workers.dev/api/lastfm');
			const track = data.songs.track[0];
			songName = track.name;
			songArtist = track.artist['#text'];
			songImgUri = track.image[track.image.length - 1]['#text'];
			songUri = track.url;
		} catch {
			error = true;
		} finally {
			loading = false;
		}
	});
</script>

<div class="flex items-center gap-1 pb-1 font-bold w-full">
	Listening
	{#if songUri}
		<a
			href={songUri}
			target="_blank"
			rel="noopener noreferrer external"
			aria-label={songName ? `Open "${songName}" on Last.fm` : 'Open current track on Last.fm'}
			><ExternalLink size={12} /></a
		>
	{/if}
</div>
<div class="flex gap-2 w-full">
	{#if songImgUri}
		<img
			src={songImgUri}
			alt={songName}
			width="48"
			height="48"
			loading="lazy"
			decoding="async"
			class="h-12 w-12 shrink-0 object-cover"
		/>
	{:else}
		<div class="h-12 w-12 shrink-0 bg-zinc-200 opacity-50 dark:bg-zinc-700"></div>
	{/if}
	<div class="flex min-w-0 flex-col justify-center">
		<div class="overflow-hidden text-sm whitespace-nowrap">
			{#if loading}
				<span class="opacity-50">...</span>
			{:else if error}
				<span class="opacity-50">n/a</span>
			{:else}
				<span
					class="marquee"
					style="animation-duration: {(songNameWidth || 200) / pxPerSecond}s"
				>
					<span bind:clientWidth={songNameWidth} class="inline-block"
						>{songName}&nbsp;&nbsp;&nbsp;&nbsp;</span
					>
					<span class="inline-block" aria-hidden="true"
						>{songName}&nbsp;&nbsp;&nbsp;&nbsp;</span
					>
				</span>
			{/if}
		</div>
		<div class="overflow-hidden text-xs whitespace-nowrap opacity-70">
			{#if loading}
				<span class="opacity-50">...</span>
			{:else if error}
				<span class="opacity-50">n/a</span>
			{:else}
				<span
					class="marquee"
					style="animation-duration: {(songArtistWidth || 200) / pxPerSecond}s"
				>
					<span bind:clientWidth={songArtistWidth} class="inline-block"
						>{songArtist}&nbsp;&nbsp;&nbsp;&nbsp;</span
					>
					<span class="inline-block" aria-hidden="true"
						>{songArtist}&nbsp;&nbsp;&nbsp;&nbsp;</span
					>
				</span>
			{/if}
		</div>
	</div>
</div>

<style>
	.marquee {
		display: inline-block;
		animation-name: marquee;
		animation-timing-function: linear;
		animation-iteration-count: infinite;
	}
	@keyframes marquee {
		0% {
			transform: translateX(0);
		}
		100% {
			transform: translateX(-50%);
		}
	}
</style>
