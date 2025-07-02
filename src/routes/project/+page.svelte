<script lang="ts">
	import * as config from '$lib/config';
	import Project from '$components/Project.svelte';

	const projects = [
		{
			title: "Houshou",
			description:
				"A minimalistic, privacy friendly and ad free blogging platform",
			tech: ["golang", "nextjs"],
			slug: "https://github.com/quantinium3/houshou"
		},
		{
			title: "Grimoire",
			description:
				"A static site generator to convert markdown to html for easy deployment.",
			tech: ["typescript", "handlebars"],
			slug: "https://github.com/quantinium3/grimoire",
		},
		{
			title: "lomes",
			description: "A self hosting media server",
			tech: ["typescript", "reactjs", "expressjs"],
			slug: "https://github.com/quantinium3/lomes"
		},
		{
			title: "nvgs",
			description:
				"nvidia graphics card switcher for laptops with hybrid gpu in linux",
			tech: ["rust"],
			slug: "https://github.com/quantinium3/nvgs"
		},
		{
			title: "tsh",
			description:
				"tmux sessionizer to create tmux session at a blazingly fast speed and increase productivity",
			tech: ["rust"],
			slug: "https://github.com/quantinium3/tsh"
		},
		{
			title: "kaze",
			description: "a image editor",
			tech: ["reactjs"],
			slug: "https://github.com/quantinium3/kaze"
		},
		{
			title: "tanshilink",
			description: "url shortener",
			tech: ["elysiajs"],
			slug: "https://github.com/quantinium3/tanshilink"
		},
		{
			title: "asami",
			description:
				"an ascii art generator to convert normal images into ascii",
			tech: ["typescript", "reactjs"],
			slug: "https://github.com/quantinium3/asami"
		},
		{
			title: "lated",
			description: "online latex editor with on the go pdf creation",
			tech: ["reactjs", "expressjs"],
			slug: "https://github.com/quantinium3/lated"
		},
		{
			title: "shiro",
			description: "infinite music app for vibing and studying",
			tech: ["reactjs"],
			slug: "https://github.com/quantinium3/shiro"
		},
		{
			title: "yumi",
			description: "package manager to fetch npm packages",
			tech: ["typescript"],
			slug: "https://github.com/quantinium3/yumi"
		},
		{
			title: "comphub",
			description:
				"online compiler platform to compile languages on the go without needing to install compiler or interpretters locally (more languages incoming)",
			tech: ["golang", "reactjs"],
			slug: "https://github.com/quantinium3/comphub"
		},
		{
			title: "ryu",
			description: "a web server written",
			tech: ["c"],
			slug: "https://github.com/quantinium3/ryu"
		}
	]
</script>

<svelte:head>
	<title>{config.title}</title>
    <meta name="description" content="quantinium's projects" />
</svelte:head>

<div class="flex mt-[3rem]">
	<div class="md:flex-3 pr-0 md:pr-12">
		{#each projects as project (project.title)}
			<Project project={project}/>
		{/each}
	</div>

	<div class="py-9 px-0 md:px-3 flex-1 hidden md:block">
		{#each projects as project (project.title)}
			<div class="flex">
				<div class="hover:underline hover:underline-offset-4 hover:font-semibold" >
					-> <a href={project.slug}>{project.title}</a>
				</div>
			</div>
		{/each}
	</div>
</div>
