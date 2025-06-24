<script>
	import { Github, Mail, Twitter } from '@lucide/svelte';
</script>

<div class="mt-[4rem] flex flex-col items-center border-b pb-3 lg:flex-row">
	<img
		src="https://pbs.twimg.com/profile_images/1902385562570375168/vl-EwVzq_400x400.jpg"
		class="mx-3 w-36 rounded-full"
		alt="pfp"
	/>
	<div class="flex flex-col justify-center">
		<div class="mt-3 text-center text-lg font-bold lg:text-left">quantinium</div>
		<div class="text-[14px]">3rd year computer science student</div>
		<div class="mt-3 flex justify-center gap-3 lg:justify-start">
			<a href="https://github.com/quantinium3" target="_blank">
				<Github size="20" />
			</a>
			<a href="https://x.com/quantinium3" target="_blank">
				<Twitter size="20" />
			</a>
			<a href="mailto:quant@quantinium.dev" target="_blank">
				<Mail size="20" />
			</a>
		</div>
	</div>
</div>

<div class="mt-5 border-b pb-3">
	<h1 class="mb-2 text-xl font-bold">About Me</h1>
	<p class="my-1">
		Good evening, I'm quantinium. My foray to the realm of tech was a successful adventure trying to
		deploy a html page on my PC (pentium G3320). This day marked the first time i properly installed
		linux on bare metal and having to learn about ssh cause i couldnt connect my monitor to my pc
		for a long time, nginx, ngrok and network address translation and how we sadly are deprived of
		public IP's. This successful deployment and installation of linux (5th time cause my drive was
		curropted) was starting of the rabbit hole of my linux journey and me nuking windows from every system i
		touched. I was installing arch so many times i had to make a guide for myself cause even though i remembered every command that needed to run, it was annoying to search for one command i forgot and then repeating the cycle of breaking my system cause i fucked something up. At some point i stopped and daily drove that distro for a year.
	</p>
	<p class="my-1"></p>
</div>

<div class="mt-5 flex flex-col gap-1 border-b pb-3">
	<h1 class="mb-2 text-xl font-bold">Tech Stack</h1>
	<div>
		<span class="font-semibold">Languages: </span>
		<span>javascript/typescript, python, golang, c++, rust, java, nix</span>
	</div>
	<div>
		<span class="font-semibold">frameworks: </span>
		<span
			>reactjs, nextjs, expressjs, tailwindcss, echo, go-fiber, nodejs, astrojs, sveltekit, axum</span
		>
	</div>
	<div>
		<span class="font-semibold">database and orms: </span>
		<span>postgres, sqlite, firebase, gorm, monogdb, drizzle, diesel</span>
	</div>
	<div>
		<span class="font-semibold">tools: </span>
		<span>git, github, neovim, intellij idea, docker, aws, vps</span>
	</div>
	<div>
		<span class="font-bold">systems: </span>
		<span>linux (arch, debain, nixos), neovim</span>
	</div>
</div>

<div class="mt-5 border-b pb-3">
	<h1 class="mb-2 text-xl font-bold">Focus</h1>
	<ul>
		<li>- backend development</li>
		<li>- frontend development</li>
		<li>- systems programming</li>
		<li>- competitive programming</li>
	</ul>
</div>

<div class="mt-5">
	<h1 class="mb-2 text-xl font-bold">Contact</h1>
	<ul>
		<li>
			- github - <a href="https://github.com/quantinium3" target="_blank" class="hover:underline">
				https://github.com/quantinium3</a
			>
		</li>
		<li>
			- x -
			<a href="https://x.com/quantinium3" class="hover:underline" target="_blank">
				https://x.com/quantinium3</a
			>
		</li>
		<li>
			- mail -
			<a href="mailto:quant@quantinium.dev" class="hover:underline" target="_blank">
				me@quantinium.dev</a
			>
		</li>
		<li>- discord - quantinium3</li>
	</ul>
</div>
