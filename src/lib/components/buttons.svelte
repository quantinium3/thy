<script lang="ts">
	const buttons: { href: string; src: string }[] = [
		{ href: 'https://namishh.com/', src: '/buttons/nam.png' },
		{ href: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', src: '/buttons/quantinium.png' },
		{ href: 'https://nithitsuki.com/', src: '/buttons/nithitsuki.png' },
		{ href: 'https://haarshmap.github.io/', src: '/buttons/harsha.png'},
		{ href: 'https://luuumine.com/', src: '/buttons/luuumine.gif'},
		{ href: 'https://helix-editor.com/', src: '/buttons/helix.gif' },
		{ href: 'https://anemoia.moe/', src: '/buttons/jesx.gif' },
		{ href: 'https://youtu.be/GSV5UDaTXDA?si=QBGDSlWK-9Cw3KtZ', src: '/buttons/linux.jpg' },
		{ href: '#', src: '/buttons/nerv.png' },
		{ href: 'https://nixos.org/manual/nixos/stable/', src: '/buttons/nix.gif' },
		{ href: 'https://svelte.dev/', src: '/buttons/svelte.gif' },
		{ href: 'https://info.cern.ch/hypertext/WWW/TheProject.html', src: '/buttons/www.gif' },
	];

	const label = (src: string) => src.split('/').pop()?.replace(/\.[^.]+$/, '') ?? 'button';

	const repeatCount = 4;
	const track = Array.from({ length: repeatCount }, () => buttons).flat();
	const pxPerSecond = 60;
	const duration = (track.length * 96) / pxPerSecond;
</script>

<div class="mt-3 border-t pt-3 dark:border-zinc-400">
	<div class="marquee overflow-hidden">
		<div
			class="marquee-track flex w-max items-center gap-2"
			style="animation-duration: {duration}s"
		>
			{#each [...track, ...track] as button, i (i)}
				{@const decorative = i >= buttons.length}
				<a
					href={button.href}
					target="_blank"
					rel="noopener noreferrer external"
					aria-hidden={decorative ? 'true' : undefined}
					tabindex={decorative ? -1 : undefined}
				>
					<img
						src={button.src}
						alt={decorative ? '' : `${label(button.src)} — 88x31 button`}
						width="88"
						height="31"
						loading="lazy"
						decoding="async"
						class="shrink-0"
					/>
				</a>
			{/each}
		</div>
	</div>
</div>

<style>
	.marquee-track {
		animation-name: marquee-scroll;
		animation-timing-function: linear;
		animation-iteration-count: infinite;
	}
	.marquee:hover .marquee-track {
		animation-play-state: paused;
	}
	.marquee-track img {
		opacity: 1;
		transition: opacity 0.15s ease;
	}
	.marquee-track:hover img {
		opacity: 0.4;
	}
	.marquee-track img:hover {
		opacity: 1;
	}
	@keyframes marquee-scroll {
		0% {
			transform: translateX(0);
		}
		100% {
			transform: translateX(-50%);
		}
	}
</style>
