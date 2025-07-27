<script lang="ts">
</script>

<div class="marquee-container">
	<div class="buttons-container">
		<a href="https://nixos.org" class="w-[88px]"><img src="/button_nix.gif" alt="nixos" /></a>
		<a href="https://neovim.io" class="w-[88px]"><img src="/button_nvim.gif" alt="neovim" /></a>
		<a href="https://archive.org/" class="w-[88px]"><img src="/button_archive.gif" alt="archive" /></a>
		<a href="https://brave.com" class="w-[88px]"><img src="/button_brave.gif" alt="brave" /></a>
		<img src="/button_computer.jpg" alt="computer" class=" w-[88px]" />
		<img src="/button_desktop.gif" alt="desktop" class="w-[88px]" />
		<a href="https://www.retrogames.cz/play_414-DOS.php" class="w-[88px]"
			><img src="/button_doom.gif" alt="doom" /></a
		>
		<a href="https://www.kernel.org/doc/html/latest/" class="w-[88px]"
			><img src="/button_linux.jpg" alt="linux" /></a
		>
		<img src="/button_nerv.png" alt="nix" class="w-[88px]" />
		<a href="http://info.cern.ch/hypertext/WWW/TheProject.html" class="w-[88px]"
			><img src="/button_www.gif" alt="www" /></a
		>
		<img src="/button_xp.gif" alt="nix" class="w-[88px]" />
		<a class="w-[88px]" href="https://namishh.com/"><img src="/button_nam.png" alt="nam" /></a>
		<a class="w-[88px]" href="https://jesx.dev/"><img src="/button_jesx.gif" alt="jesx" /></a>
		<a class="w-[88px]" href="https://svelte.dev/"><img src="/button_svelte.gif" alt="svelte" /></a>
		<a class="w-[88px]" href="https://developer.mozilla.org/en-US/docs/Glossary/HTML"><img src="/button_html.gif" alt="html" /></a>
            <a class="w-[88px]" href="https://nixos.org/"><img src="/button_nixos.gif" alt="nixos" /></a>
	</div>
	<div class="buttons-container">
		<a href="https://nixos.org" class="w-[88px]"><img src="/button_nix.gif" alt="nix" /></a>
		<a href="https://neovim.io" class="w-[88px]"><img src="/button_nvim.gif" alt="nix" /></a>
		<a href="https://neovim.io" class="w-[88px]"><img src="/button_archive.gif" alt="nix" /></a>
		<a href="https://brave.com" class="w-[88px]"><img src="/button_brave.gif" alt="nix" /></a>
		<img src="/button_computer.jpg" alt="nix" class="w-[88px]" />
		<img src="/button_desktop.gif" alt="nix" class="w-[88px]" />
		<a href="https://www.retrogames.cz/play_414-DOS.php" class="w-[88px]"
			><img src="/button_doom.gif" alt="nix" /></a
		>
		<a href="https://www.kernel.org/doc/html/latest/" class="w-[88px]"
			><img src="/button_linux.jpg" alt="nix" /></a
		>
		<img src="/button_nerv.png" alt="nix" class="w-[88px]" />
		<a href="http://info.cern.ch/hypertext/WWW/TheProject.html" class="w-[88px]"
			><img src="/button_www.gif" alt="nix" /></a
		>
		<img src="/button_xp.gif" alt="nix" class="w-[88px]" />
		<a class="w-[88px]" href="https://namishh.me/"><img src="/button_nam.png" alt="nam" /></a>
		<a class="w-[88px]" href="https://jesx.dev/"><img src="/button_jesx.gif" alt="jesx" /></a>
		<a class="w-[88px]" href="https://jesx.dev/"><img src="/button_svelte.gif" alt="jesx" /></a>
		<a class="w-[88px]" href="https://jesx.dev/"><img src="/button_html.gif" alt="jesx" /></a>
		<a class="w-[88px]" href="https://jesx.dev/"><img src="/button_nixos.gif" alt="jesx" /></a>
	</div>
</div>

<style>
	.marquee-container {
		overflow: hidden;
		white-space: nowrap;
		display: flex;
	}

	.buttons-container {
		display: flex;
		gap: 1rem;
		position: absolute;
		white-space: nowrap;
		animation: marquee 20s linear infinite;
	}

	.buttons-container a,
	.buttons-container img {
		width: 88px;
		min-width: 88px;
		max-width: 88px;
		height: auto;
		display: inline-block;
	}

	@keyframes marquee {
		0% {
			transform: translateX(0%);
		}
		100% {
			transform: translateX(-60%);
		}
	}
</style>
