<script lang="ts">
	import Cat from '@lucide/svelte/icons/cat';
	import { onMount } from 'svelte';
	import { fly } from 'svelte/transition';
	import { nextSwatchPose, onekoSkins, onekoSwatchStyle } from '$lib/oneko';

	const SEQUENCE = 'oneko';

	let available = $state(false);
	let open = $state(false);
	let current = $state('classic');
	let kuro = $state(false);
	let pose = $state(nextSwatchPose());
	let root = $state<HTMLElement | null>(null);
	let typed = '';

	onMount(() => {
		if (window.oneko) {
			available = true;
			return;
		}
		const onReady = () => (available = true);
		window.addEventListener('oneko:ready', onReady, { once: true });
		return () => window.removeEventListener('oneko:ready', onReady);
	});

	function openPicker() {
		if (!available) return;
		current = window.oneko!.getSkin();
		kuro = window.oneko!.getKuro();
		pose = nextSwatchPose();
		open = true;
	}

	function select(id: string) {
		current = id;
		window.oneko?.setSkin(id);
		open = false;
	}

	function onWindowClick(event: MouseEvent) {
		if (open && root && !root.contains(event.target as Node)) open = false;
	}

	function onWindowKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			open = false;
			return;
		}
		if (event.ctrlKey || event.metaKey || event.altKey || event.key.length !== 1) return;

		const target = event.target as HTMLElement | null;
		if (target && (target.isContentEditable || /^(input|textarea|select)$/i.test(target.tagName))) {
			return;
		}

		typed = (typed + event.key.toLowerCase()).slice(-SEQUENCE.length);
		if (typed === SEQUENCE) {
			typed = '';
			openPicker();
		}
	}
</script>

<svelte:window onclick={onWindowClick} onkeydown={onWindowKeydown} />

{#if available}
	<div class="relative" bind:this={root}>
		<button
			onclick={() => (open ? (open = false) : openPicker())}
			aria-label="Pick cat"
			aria-expanded={open}
			class="flex cursor-pointer items-center gap-0.5"
		>
			<span>[</span>
			<span class="flex h-5 w-4 items-center justify-center">
				<Cat size={14} />
			</span>
			<span>]</span>
		</button>

		{#if open}
			<div
				transition:fly={{ y: -6, duration: 150 }}
				class="absolute right-0 z-50 mt-1 w-56 border border-zinc-500 bg-white p-2 dark:bg-[#1a1a1a]"
			>
				<div class="grid grid-cols-4 gap-1" class:kuro>
					{#each onekoSkins as skin (skin.id)}
						<button
							onclick={() => select(skin.id)}
							title={skin.label}
							aria-label={skin.label}
							aria-current={current === skin.id}
							class="swatch h-12 w-12 border {current === skin.id
								? 'border-zinc-500 bg-zinc-200 dark:bg-zinc-800'
								: 'border-transparent hover:border-zinc-500'}"
							style={onekoSwatchStyle(skin.id, pose)}
						></button>
					{/each}
				</div>
				<button
					onclick={() => select('none')}
					class="mt-2 w-full cursor-pointer border border-zinc-500 py-1 text-xs hover:bg-zinc-200 dark:hover:bg-zinc-800 {current ===
					'none'
						? 'bg-zinc-200 dark:bg-zinc-800'
						: ''}"
				>
					no cat
				</button>
				<p class="mt-2 text-center text-[10px] leading-tight opacity-60">
					drag her around &middot; right-click to invert &middot; type <code>oneko</code>
				</p>
			</div>
		{/if}
	</div>
{/if}

<style>
	.swatch {
		image-rendering: pixelated;
		background-position: var(--rest-x) var(--rest-y);
	}

	.swatch:hover {
		background-position: var(--active-x) var(--active-y);
	}

	.kuro .swatch {
		filter: invert(100%);
	}
</style>
