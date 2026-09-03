<script lang="ts">
	import { fly } from 'svelte/transition';
	import ChevronLeft from '@lucide/svelte/icons/chevron-left';
	import ChevronRight from '@lucide/svelte/icons/chevron-right';
	import GameOfLife from './game-of-life.svelte';
	import AsciiClock from './ascii-clock.svelte';
	import BadAppleLife from './bad-apple-life.svelte';
	import { items as allItems, type CarouselItem } from '$lib/carousel';

	let { pin }: { pin?: CarouselItem } = $props();

	const items: CarouselItem[] = $derived(pin ? [pin] : allItems);

	let current = $state(0);
	let direction = $state(1);

	const item: CarouselItem = $derived(items[current] ?? items[0]);

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
				{#if item.type === 'gol'}
					<GameOfLife />
				{:else if item.type === 'clock'}
					<AsciiClock />
				{:else if item.type === 'badapple'}
					<BadAppleLife />
				{:else if item.type === 'image'}
					<img
						src={item.src}
						alt={item.alt}
						width="380"
						height="380"
						fetchpriority="high"
						decoding="async"
						class="h-full w-full bg-transparent object-cover"
					/>
				{/if}
			</div>
		{/key}
	</div>

	{#if items.length > 1}
		<div class="flex items-center justify-between text-xs opacity-60">
			<button onclick={prev} aria-label="Previous item" class="cursor-pointer hover:opacity-100"
				><ChevronLeft size={14} /></button
			>
			<span>[{current + 1}/{items.length}]</span>
			<button onclick={next} aria-label="Next item" class="cursor-pointer hover:opacity-100"
				><ChevronRight size={14} /></button
			>
		</div>
	{/if}
</div>
