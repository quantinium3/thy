<script>
	import { Github, Mail, Twitter } from '@lucide/svelte';
</script>

<div
	class="flex flex-col lg:flex-row items-center mt-5 border-b pb-3">
	<img
		src="https://pbs.twimg.com/profile_images/1902385562570375168/vl-EwVzq_400x400.jpg"
		class="rounded-full w-36 mx-3" alt="pfp" />
	<div class="flex flex-col justify-center">
		<div class="font-bold text-lg mt-3 text-center lg:text-left">quantinium
		</div>
		<div class="text-[14px]">3rd year computer science student
		</div>
		<div class="flex gap-3 mt-3 justify-center lg:justify-start">
			<a href="https://github.com/quantinium3"
				 target="_blank">
				<Github size="20" />
			</a>
			<a href="https://x.com/quantinium3"
				 target="_blank">
				<Twitter size="20" />
			</a>
			<a href="mailto:quant@quantinium.dev"
				 target="_blank">
				<Mail size="20" />
			</a>
		</div>
	</div>
</div>

<div class="mt-5 border-b pb-3">
	<h1 class="font-bold text-xl mb-2">About Me</h1>
	<p class="my-1">Lorem ipsum dolor sit amet consectetur adipisicing elit. Fuga
		aperiam quo explicabo asperiores pariatur. Magnam ipsum eaque et dolorum
		sapiente, aut tempore nam voluptatem laudantium voluptates nisi
		exercitationem error consequuntur!</p>
	<p class="my-1">Lorem ipsum dolor sit amet consectetur adipisicing elit. Fuga
		aperiam quo explicabo asperiores pariatur. Magnam ipsum eaque et dolorum
		sapiente, aut tempore nam voluptatem laudantium voluptates nisi
		exercitationem error consequuntur!</p>
</div>

<div class="mt-5 flex flex-col gap-1 border-b pb-3">
	<h1 class="font-bold text-xl mb-2">Tech Stack</h1>
	<div>
		<span class="font-semibold">Languages: </span>
		<span>javascript/typescript, python, golang, c++, rust, java, nix</span>
	</div>
	<div>
		<span class="font-semibold">frameworks: </span>
		<span>reactjs, nextjs, expressjs, tailwindcss, echo, go-fiber, nodejs,
			astrojs,
			sveltekit, axum</span>
	</div>
	<div>
		<span class="font-semibold">database and orms: </span>
		<span>postgres, sqlite, firebase, gorm, monogdb, drizzle, diesel</span>
	</div>
	<div>
		<span class="font-semibold">tools: </span>
		<span>git, github, neovim, intellij idea,  docker, aws, vps</span>
	</div>
	<div>
		<span class="font-bold">systems: </span>
		<span>linux (arch, debain, nixos), neovim</span>
	</div>
</div>

<div class="mt-5 border-b pb-3">
	<h1 class="font-bold text-xl mb-2">Focus</h1>
	<ul>
		<li>- backend development</li>
		<li>- frontend development</li>
		<li>- systems programming</li>
		<li>- competitive programming</li>
	</ul>
</div>

<div class="mt-5">
	<h1 class="font-bold text-xl mb-2">Contact</h1>
	<ul>
		<li>- github - <a href="https://github.com/quantinium3" target="_blank"
											class="hover:underline">
			https://github.com/quantinium3</a></li>
		<li>- x -
			<a href="https://x.com/quantinium3" class="hover:underline"
				 target="_blank">
				https://x.com/quantinium3</a></li>
		<li>- mail -
			<a href="mailto:quant@quantinium.dev" class="hover:underline"
				 target="_blank">
				me@quantinium.dev</a></li>
		<li>- discord - quantinium3</li>
	</ul>
</div>
