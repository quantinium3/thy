<script lang="ts">
	import { Copyright, Github, Mail, Rss, Twitter } from '@lucide/svelte';
	import CodeStatus from './CodeStatus.svelte';
	import Peripheral from './Peripheral.svelte';
	import Song from './Song.svelte';
	import { onMount } from 'svelte';
	import axios from 'axios';

	const links = [
		{
			name: 'home',
			href: '/'
		},
		{
			name: 'about',
			href: '/about'
		},
		{
			name: 'project',
			href: '/project'
		},
		{
			name: 'blog',
			href: '/blog'
		},
		{
			name: 'github',
			href: 'https://github.com/quantinium3'
		},
		{
			name: 'last.fm',
			href: 'https://www.last.fm/user/Quantinium_X'
		},
		{
			name: 'contact',
			href: '/about#contact'
		},
		{
			name: 'logs',
			href: '/logs'
		},
		{
			name: 'spotify',
			href: 'https://open.spotify.com/user/alcivd1065ibqww5vo9hemnus?si=9626e0194c4e418f'
		},
	];

	let status = $state('offline');
	let neovimActivity = $state('');
	onMount(() => {
		axios.get('https://api.lanyard.rest/v1/users/629491500954157076').then((res) => {
			neovimActivity = res.data.data.activities.find((item) => item.name == 'Neovim')?.state;
			status = res.data.data.discord_status;
		});
	});
</script>

<div class="item-center flex flex-col justify-center">
	<img src="/favicon.jpg" alt="pfp" class="self-center rounded" />
	{#if status == 'offline'}
		<span class="py-1 text-center text-lg">
			<span class="inline-flex items-center gap-1">
				<span class="h-2 w-2 animate-pulse rounded-full bg-red-500"></span>
				{status.toUpperCase()}
			</span>
		</span>
	{:else if status == 'online'}
		<span class="py-1 text-center text-lg">
			<span class="inline-flex items-center gap-1">
				<span class="h-2 w-2 animate-pulse rounded-full bg-green-500"></span>
				{status.toUpperCase()}
			</span>
			{#if neovimActivity}
				-
				{neovimActivity}
			{/if}
		</span>
	{/if}
</div>
<div class="my-5">
	<span class="text-lg font-bold">navi</span>
	{#each links as link (link.href)}
		<div class="ml-2 flex flex-row gap-1 border-l dark:border-white border-black">
			<span>–</span>
			<span><a href={link.href} class="hover:underline hover:underline-offset-2 pt-1">{link.name}</a></span>
		</div>
	{/each}
	<span class="relative bottom-[1.02px] ml-1"
		>└
		<a href="/rss-xml" class="hover:underline hover:underline-offset-2">rss</a></span
	>
</div>

<div class="my-5">
	<Song />
</div>

<div class="my-5">
	<CodeStatus />
</div>

<div class="my-5">
	<Peripheral />
</div>

<div class="border-t py-3">
	<Copyright class="inline" size={15} />quantinium
	{new Date().getFullYear()}
</div>
<div class="flex gap-3">
	<a href="https://github.com/quantinium3" target="_blank"><Github /></a>
	<a href="https://x.com/quantinium3" target="_blank"><Twitter /></a>
	<a href="mailto:quant@quantinium.dev" target="_blank"><Mail /></a>
	<a href="/rss-xml" target="_blank"><Rss /></a>
</div>
