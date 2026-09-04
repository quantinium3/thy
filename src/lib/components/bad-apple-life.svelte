<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { CELL } from '$lib/carousel';

	let container: HTMLDivElement;
	let canvas: HTMLCanvasElement;
	let running = $state(true);
	let loaded = $state(false);
	let failed = $state(false);
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

	let drawCols = 0;
	let drawRows = 0;
	let cellW = 0;
	let cellH = 0;
	let xEdges: Uint16Array = new Uint16Array(0);
	let yEdges: Uint16Array = new Uint16Array(0);

	function edges(source: number, target: number) {
		const e = new Uint16Array(target + 1);
		for (let i = 0; i <= target; i++) e[i] = Math.floor((i * source) / target);
		return e;
	}

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

		const w = Math.max(1, Math.ceil(cellW) - 1);
		const h = Math.max(1, Math.ceil(cellH) - 1);

		ctx.fillStyle = dark ? '#a1a1aa' : '#3f3f46';
		for (let y = 0; y < drawRows; y++) {
			const sy0 = yEdges[y];
			const sy1 = Math.max(sy0 + 1, yEdges[y + 1]);
			for (let x = 0; x < drawCols; x++) {
				const sx0 = xEdges[x];
				const sx1 = Math.max(sx0 + 1, xEdges[x + 1]);

				let on = 0;
				let total = 0;
				for (let sy = sy0; sy < sy1; sy++) {
					for (let sx = sx0; sx < sx1; sx++) {
						on += pixel(currentFrame, sy, sx);
						total++;
					}
				}

				if (on * 2 >= total) ctx.fillRect(x * cellW, y * cellH, w, h);
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
		const w = container.clientWidth;
		const h = container.clientHeight;
		canvas.width = w;
		canvas.height = h;

		if (loaded && w > 0 && h > 0) {
			drawCols = Math.min(cols, Math.max(1, Math.round(w / CELL)));
			drawRows = Math.min(rows, Math.max(1, Math.round(h / CELL)));
			cellW = w / drawCols;
			cellH = h / drawRows;
			xEdges = edges(cols, drawCols);
			yEdges = edges(rows, drawRows);
		}

		draw();
	}

	async function load() {
		try {
			const res = await fetch('/bad-apple.bin.gz');
			if (!res.ok) throw new Error(`bad apple: ${res.status}`);

			let buf = new Uint8Array(await res.arrayBuffer());

			if (buf[0] === 0x1f && buf[1] === 0x8b) {
				if (typeof DecompressionStream === 'undefined') throw new Error('no gzip');
				const stream = new Response(buf).body!.pipeThrough(new DecompressionStream('gzip'));
				buf = new Uint8Array(await new Response(stream).arrayBuffer());
			}

			const view = new DataView(buf.buffer, buf.byteOffset, buf.byteLength);
			frameCount = view.getUint16(0, true);
			rows = view.getUint16(2, true);
			cols = view.getUint16(4, true);
			bytesPerFrame = (rows * cols) / 8;
			bytes = buf;
			loaded = true;
			resize();
		} catch {
			failed = true;
		}
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
	{#if failed}
		<div class="absolute inset-0 flex items-center justify-center text-xs opacity-50">
			bad apple failed to load.
		</div>
	{:else if !loaded}
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
