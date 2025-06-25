<script>
	import { Copyright, Github, Mail, Twitter } from '@lucide/svelte';
</script>

<div class="mt-[4rem] flex flex-col items-center border-b pb-5 lg:flex-row">
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

<div class="border-b py-5">
	<h1 class="mb-2 text-xl font-bold">About Me</h1>
	<p class="my-2">
		<span class="mb-1 block text-lg font-semibold">Good day,</span>
		I'm a programmer who started with an urge to deploying a html page on my old pc and then fell down
		the rabbit hole of linux, window managers, neovim and then started to learn to program on May 12
		2024. I have dabbled in various domains and learnt many languages along the way. Primarily i focus
		on backend and frontend development and devops but is interested in systems programming. Some facts
		about me -
	</p>
	<ul class="list-disc pb-2 pl-[1rem]">
		<li class="">
			My first code editor was neovim and nuked windows from my machine after having it for 4
			months.
		</li>
		<li class="">
			My first experience with web development was so boring, i did my first api request in C++.
		</li>
		<li class="">
			I love space and wish i could just lay down on the moon and just look as far as i can see in
			space with no one to disturb me.
		</li>
		<li class="">I love programming and learning new things what this piece of rock can do.</li>
	</ul>
</div>

<div class="flex flex-col gap-1 border-b py-5">
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

<div class="border-b py-5">
	<h1 class="mb-2 text-xl font-bold">Focus</h1>
	<ul>
		<li>- backend development</li>
		<li>- frontend development</li>
		<li>- systems programming</li>
		<li>- competitive programming</li>
	</ul>
</div>

<div class="py-5">
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

<footer class="border-t py-5">
	<div class="flex items-center justify-center"><Copyright size={16}/>quantinium {new Date().getFullYear()}</div>
</footer>
