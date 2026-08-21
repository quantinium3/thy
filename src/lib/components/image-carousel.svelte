<script lang="ts">
	import { fly } from 'svelte/transition';
	import { ChevronLeft, ChevronRight } from '@lucide/svelte';
	import GameOfLife from './game-of-life.svelte';
	import AsciiClock from './ascii-clock.svelte';
	import BadAppleLife from './bad-apple-life.svelte';

	const items = [
		{ type: 'image', src: '/frieren.jpg', alt: 'frieren 1' },
		{ type: 'clock' },
		{ type: 'gol' },
		{ type: 'badapple' },
		{ type: 'image', src: '/teto.png', alt: 'teto' }
	];

	let current = $state(0);
	let direction = $state(1);

	function go(next: number) {
		direction = next > current ? 1 : -1;
		current = (next + items.length) % items.length;
	}

	const prev = () => go(current - 1);
	const next = () => go(current + 1);
</script>

<div class="flex flex-col gap-1">
	<div class="relative aspect-square overflow-hidden">
		{#key current}
			<div
				class="absolute inset-0 h-full w-full"
				in:fly={{ x: direction * 40, duration: 150 }}
				out:fly={{ x: direction * -40, duration: 150 }}
			>
				{#if items[current].type === 'gol'}
					<GameOfLife />
				{:else if items[current].type === 'clock'}
					<AsciiClock />
				{:else if items[current].type === 'badapple'}
					<BadAppleLife />
				{:else}
					<img
						src={items[current].src}
						alt={items[current].alt}
						class="h-full w-full bg-transparent object-cover"
					/>
				{/if}
			</div>
		{/key}
	</div>

	{#if items.length > 1}
		<div class="flex items-center justify-between text-xs opacity-60">
			<button onclick={prev} class="cursor-pointer hover:opacity-100"
				><ChevronLeft size={14} /></button
			>
			<span>[{current + 1}/{items.length}]</span>
			<button onclick={next} class="cursor-pointer hover:opacity-100"
				><ChevronRight size={14} /></button
			>
		</div>
	{/if}
</div>
