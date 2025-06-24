<script lang="ts">
	import { Copyright, Github, Mail, Rss, Twitter } from '@lucide/svelte';
	import CodeStatus from './CodeStatus.svelte';
	import Peripheral from './Peripheral.svelte';
	import Song from './Song.svelte';

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
		{
			name: 'rss',
			href: '/rss-xml'
		}
	];
</script>

<div class="item-center flex flex-col justify-center">
	<img src="/favicon.jpg" alt="pfp" class="self-center rounded" />
	<span class="py-1 text-center text-lg">online</span>
</div>
<div class="my-5">
	<span class="text-lg font-bold">navi</span>
	{#each links as link (link.href)}
		<div class="ml-2 flex flex-row gap-1 border-l border-white">
			<span>–</span>
			<span><a href={link.href} class="link-animate pt-1">{link.name}</a></span>
		</div>
	{/each}
	<span class="relative bottom-[1.02px] ml-1"
		>└
		<a href="/resume" class="link-animate">resume</a></span
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

<style>
	.link-animate {
		position: relative;
		text-decoration: none;
	}

	.link-animate:hover {
		right: 0;
		text-decoration: none;
	}

	.link-animate:hover:after {
		right: 0;
	}

	.link-animate:after {
		border-radius: 1em;
		border-top: 0.1em solid;
		content: '';
		position: absolute;
		right: 100%;
		bottom: 0.14em;
		left: 0;
		transition:
			right 0.4s cubic-bezier(0, 0.5, 0, 1),
			border-color 0.4s ease-out;
	}

	.link-animate:hover:after {
		right: 0;
	}
</style>
