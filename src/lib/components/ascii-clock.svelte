<script lang="ts">
	import { onMount, onDestroy } from 'svelte';

	const DIGITS = [
		[1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1], // 0
		[0, 1, 0, 1, 1, 0, 0, 1, 0, 0, 1, 0, 1, 1, 1], // 1
		[1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1], // 2
		[1, 1, 1, 0, 0, 1, 0, 1, 1, 0, 0, 1, 1, 1, 1], // 3
		[1, 0, 1, 1, 0, 1, 1, 1, 1, 0, 0, 1, 0, 0, 1], // 4
		[1, 1, 1, 1, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 1], // 5
		[1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1], // 6
		[1, 1, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 1, 0], // 7
		[1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1], // 8
		[1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1] // 9
	];
	const COLON = [0, 1, 0, 1, 0];

	const DW = 3; // digit width in pixel units
	const DH = 5; // digit height in pixel units

	let canvas: HTMLCanvasElement;
	let container: HTMLDivElement;
	let animationId: number;
	let ro: ResizeObserver;
	let lastSecond = -1;

	function draw() {
		animationId = requestAnimationFrame(draw);
		if (!canvas) return;

		const now = new Date();
		const sec = now.getSeconds();
		// only redraw when second changes or colon needs to blink
		if (sec === lastSecond) return;
		lastSecond = sec;

		const ctx = canvas.getContext('2d')!;
		const dark = document.documentElement.classList.contains('dark');
		const fg = dark ? '#a1a1aa' : '#3f3f46';
		const bg = dark ? '#18181b' : '#ffffff';

		const W = canvas.width;
		const H = canvas.height;
		ctx.fillStyle = bg;
		ctx.fillRect(0, 0, W, H);

		// totalW ≈ 41*px, clockH ≈ 6*px, with date below ≈ 9*px total
		const px = Math.max(1, Math.floor(Math.min(W / 41, H / 9)));
		const gap = Math.max(1, Math.round(px * 0.25));

		const charW = DW * px + (DW - 1) * gap;
		const charH = DH * px + (DH - 1) * gap;
		const colonW = px;
		const charGap = 2 * px;
		const groupGap = 3 * px;

		const totalW = 3 * (2 * charW + charGap) + 2 * colonW + 4 * groupGap;
		const fontSize = Math.max(10, Math.round(H * 0.065));
		const contentH = charH + fontSize * 2.2;
		const ox = Math.floor((W - totalW) / 2);
		const oy = Math.floor((H - contentH) / 2);

		const parts = [
			String(now.getHours()).padStart(2, '0'),
			String(now.getMinutes()).padStart(2, '0'),
			String(now.getSeconds()).padStart(2, '0')
		];

		ctx.fillStyle = fg;
		let x = ox;

		parts.forEach((pair, gi) => {
			if (gi > 0) {
				x += groupGap;
				const blink = sec % 2 === 0;
				COLON.forEach((on, row) => {
					if (on && blink) {
						ctx.fillRect(x, oy + row * (px + gap), px, px);
					}
				});
				x += colonW + groupGap;
			}
			pair.split('').forEach((ch, di) => {
				if (di > 0) x += charGap;
				const bitmap = DIGITS[parseInt(ch)];
				for (let row = 0; row < DH; row++) {
					for (let col = 0; col < DW; col++) {
						if (bitmap[row * DW + col]) {
							ctx.fillRect(x + col * (px + gap), oy + row * (px + gap), px, px);
						}
					}
				}
				x += charW;
			});
		});

		const dateStr = now.toLocaleDateString('en-GB', {
			weekday: 'long',
			day: 'numeric',
			month: 'long'
		});
		ctx.font = `${fontSize}px monospace`;
		ctx.fillStyle = dark ? 'rgba(161,161,170,0.7)' : 'rgba(63,63,70,0.7)';
		ctx.textAlign = 'center';
		ctx.fillText(dateStr, W / 2, oy + charH + fontSize * 1.8);
	}

	function resize() {
		if (!canvas || !container) return;
		canvas.width = container.clientWidth;
		canvas.height = container.clientHeight;
		lastSecond = -1; // force redraw
	}

	onMount(() => {
		resize();
		animationId = requestAnimationFrame(draw);
		ro = new ResizeObserver(resize);
		ro.observe(container);
	});

	onDestroy(() => {
		cancelAnimationFrame(animationId);
		ro?.disconnect();
	});
</script>

<div bind:this={container} class="h-full w-full bg-white dark:bg-zinc-900">
	<canvas bind:this={canvas} class="block h-full w-full"></canvas>
</div>
