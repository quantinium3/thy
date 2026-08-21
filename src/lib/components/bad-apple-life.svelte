<script lang="ts">
	import { onMount, onDestroy } from 'svelte';

	let container: HTMLDivElement;
	let canvas: HTMLCanvasElement;
	let running = $state(true);
	let loaded = $state(false);
	let animationId: number;
	let lastTime = 0;
	const FPS = 30;
	const INTERVAL = 1000 / FPS;

	let bytes: Uint8Array;
	let frameCount = 0;
	let rows = 0;
	let cols = 0;
	let bytesPerFrame = 0;
	let currentFrame = 0;

	function pixel(frame: number, row: number, col: number) {
		const bitIndex = row * cols + col;
		const byteIndex = 6 + frame * bytesPerFrame + (bitIndex >> 3);
		const bitOffset = 7 - (bitIndex & 7);
		return (bytes[byteIndex] >> bitOffset) & 1;
	}

	function draw() {
		if (!loaded) return;
		const ctx = canvas.getContext('2d')!;
		const dark = document.documentElement.classList.contains('dark');
		ctx.fillStyle = dark ? '#18181b' : '#ffffff';
		ctx.fillRect(0, 0, canvas.width, canvas.height);

		const offsetX = 0;
		const offsetY = 0;
		const cellW = canvas.width / cols;
		const cellH = canvas.height / rows;

		ctx.fillStyle = dark ? '#a1a1aa' : '#3f3f46';
		for (let y = 0; y < rows; y++) {
			for (let x = 0; x < cols; x++) {
				if (pixel(currentFrame, y, x)) {
					ctx.fillRect(
						offsetX + x * cellW,
						offsetY + y * cellH,
						Math.max(1, Math.ceil(cellW) - 1),
						Math.max(1, Math.ceil(cellH) - 1)
					);
				}
			}
		}
	}

	function loop(ts: number) {
		animationId = requestAnimationFrame(loop);
		if (!running || !loaded) return;
		if (ts - lastTime < INTERVAL) return;
		lastTime = ts;
		draw();
		currentFrame = (currentFrame + 1) % frameCount;
	}

	function resize() {
		if (!canvas || !container) return;
		canvas.width = container.clientWidth;
		canvas.height = container.clientHeight;
		draw();
	}

	async function load() {
		const res = await fetch('/bad-apple.bin');
		const buf = new Uint8Array(await res.arrayBuffer());
		bytes = buf;
		const view = new DataView(buf.buffer);
		frameCount = view.getUint16(0, true);
		rows = view.getUint16(2, true);
		cols = view.getUint16(4, true);
		bytesPerFrame = (rows * cols) / 8;
		loaded = true;
		resize();
	}

	onMount(() => {
		load();
		animationId = requestAnimationFrame(loop);
		const ro = new ResizeObserver(resize);
		ro.observe(container);
		return () => ro.disconnect();
	});

	onDestroy(() => cancelAnimationFrame(animationId));
</script>

<div bind:this={container} class="group relative h-full w-full">
	<canvas bind:this={canvas} class="block h-full w-full"></canvas>
	{#if !loaded}
		<div class="absolute inset-0 flex items-center justify-center text-xs opacity-50">
			loading bad apple...
		</div>
	{/if}
	<div
		class="absolute bottom-1 left-1 flex gap-2 text-xs opacity-0 transition-opacity group-hover:opacity-60"
	>
		<button
			onclick={() => (running = !running)}
			class="bg-surface-100/80 cursor-pointer px-1 hover:opacity-100"
		>
			[{running ? 'pause' : 'play'}]
		</button>
		<button
			onclick={() => {
				currentFrame = 0;
				draw();
			}}
			class="bg-surface-100/80 cursor-pointer px-1 hover:opacity-100"
		>
			[restart]
		</button>
	</div>
</div>
