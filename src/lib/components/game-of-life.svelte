<script lang="ts">
	import { onMount, onDestroy } from 'svelte';

	let container: HTMLDivElement;
	let canvas: HTMLCanvasElement;
	let running = $state(true);
	let animationId: number;
	let lastTime = 0;
	const FPS = 10;
	const INTERVAL = 1000 / FPS;
	const CELL = 4;

	let cols = 0;
	let rows = 0;
	let grid: Uint8Array;

	function idx(x: number, y: number) {
		return y * cols + x;
	}

	function randomGrid() {
		grid = new Uint8Array(cols * rows);
		for (let i = 0; i < grid.length; i++) {
			grid[i] = Math.random() > 0.72 ? 1 : 0;
		}
	}

	function nextGen() {
		const next = new Uint8Array(cols * rows);
		for (let y = 0; y < rows; y++) {
			for (let x = 0; x < cols; x++) {
				let n = 0;
				for (let dy = -1; dy <= 1; dy++) {
					for (let dx = -1; dx <= 1; dx++) {
						if (dy === 0 && dx === 0) continue;
						n += grid[idx((x + dx + cols) % cols, (y + dy + rows) % rows)];
					}
				}
				const alive = grid[idx(x, y)];
				next[idx(x, y)] = n === 3 || (alive && n === 2) ? 1 : 0;
			}
		}
		grid = next;
	}

	function draw() {
		const ctx = canvas.getContext('2d')!;
		const dark = document.documentElement.classList.contains('dark');
		ctx.fillStyle = dark ? '#18181b' : '#ffffff';
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		ctx.fillStyle = dark ? '#a1a1aa' : '#3f3f46';
		for (let y = 0; y < rows; y++) {
			for (let x = 0; x < cols; x++) {
				if (grid[idx(x, y)]) {
					ctx.fillRect(x * CELL, y * CELL, CELL - 1, CELL - 1);
				}
			}
		}
	}

	function loop(ts: number) {
		animationId = requestAnimationFrame(loop);
		if (!running) return;
		if (ts - lastTime < INTERVAL) return;
		lastTime = ts;
		nextGen();
		draw();
	}

	function init() {
		if (!canvas || !container) return;
		const w = container.clientWidth;
		const h = container.clientHeight;
		canvas.width = w;
		canvas.height = h;
		cols = Math.floor(w / CELL);
		rows = Math.floor(h / CELL);
		if (cols > 0 && rows > 0) {
			randomGrid();
			draw();
		}
	}

	onMount(() => {
		init();
		animationId = requestAnimationFrame(loop);
		const ro = new ResizeObserver(init);
		ro.observe(container);
		return () => ro.disconnect();
	});

	onDestroy(() => cancelAnimationFrame(animationId));
</script>

<div bind:this={container} class="group relative h-full w-full">
	<canvas bind:this={canvas} class="block h-full w-full"></canvas>
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
				randomGrid();
				draw();
			}}
			class="bg-surface-100/80 cursor-pointer px-1 hover:opacity-100"
		>
			[reset]
		</button>
	</div>
</div>
