<script lang="ts">
	import * as config from '$lib/config';
	import Project from '$components/Project.svelte';

	const projects = [
		{
			title: "Grimoire",
			description: "Static site generator",
			categories: ["typescript", "handlebars"],
			slug: 'https://github.com/quantinium3/grimoire'
		},
		{
			title: "Grimoire",
			description: "Static site generator",
			categories: ["typescript", "handlebars"],
			slug: 'https://github.com/quantinium3/grimoire'
		}
	]
</script>

<svelte:head>
	<title>{config.title}</title>
</svelte:head>

<div class="flex">
	<div class="md:flex-3/4 pr-0 md:pr-12">
		{#each projects as project (project)}
			<Project {project}/>
		{/each}
	</div>

	<div class="py-9 px-0 md:px-3 flex-1/4 hidden md:block">
		{#each projects as project (project.title)}
			<div class="flex">
				<div class="hover:underline hover:underline-offset-4 hover:font-semibold" >
					-> {project.title}
				</div>
			</div>
		{/each}
	</div>
</div>
