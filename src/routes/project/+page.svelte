<script lang="ts">
	import * as config from '$lib/config';
	import Project from '$components/Project.svelte';

	const projects = [
		{
			title: "Grimoire",
			description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Architecto rem earum doloribus atque temporibus veritatis cum aliquam inventore animi consequuntur ad reiciendis nisi asperiores, id laudantium repellendus, recusandae illo vitae?",
			tech: ["typescript", "handlebars"],
			slug: "https://github.com/quantinium3/grimoire",
		},
		{
			title: "lomes",
			description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Architecto rem earum doloribus atque temporibus veritatis cum aliquam inventore animi consequuntur ad reiciendis nisi asperiores, id laudantium repellendus, recusandae illo vitae?",
			tech: ["typescript", "reactjs"],
			slug: "https://github.com/quantinium3/lomes"
		},
		{
			title: "nvgs",
			description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Architecto rem earum doloribus atque temporibus veritatis cum aliquam inventore animi consequuntur ad reiciendis nisi asperiores, id laudantium repellendus, recusandae illo vitae?",
			tech: ["rust", "reactjs"],
			slug: "https://github.com/quantinium3/nvgs"
		},
		{
			title: "tsh",
			description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Architecto rem earum doloribus atque temporibus veritatis cum aliquam inventore animi consequuntur ad reiciendis nisi asperiores, id laudantium repellendus, recusandae illo vitae?",
			tech: ["typescript", "reactjs"],
			slug: "https://github.com/quantinium3/tsh"
		},
		{
			title: "kaze",
			description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Architecto rem earum doloribus atque temporibus veritatis cum aliquam inventore animi consequuntur ad reiciendis nisi asperiores, id laudantium repellendus, recusandae illo vitae?",
			tech: ["typescript", "reactjs"],
			slug: "https://github.com/quantinium3/kaze"
		},
		{
			title: "tanshilink",
			description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Architecto rem earum doloribus atque temporibus veritatis cum aliquam inventore animi consequuntur ad reiciendis nisi asperiores, id laudantium repellendus, recusandae illo vitae?",
			tech: ["typescript", "reactjs"],
			slug: "https://github.com/quantinium3/tanshilink"
		},
		{
			title: "asami",
			description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Architecto rem earum doloribus atque temporibus veritatis cum aliquam inventore animi consequuntur ad reiciendis nisi asperiores, id laudantium repellendus, recusandae illo vitae?",
			tech: ["typescript", "reactjs"],
			slug: "https://github.com/quantinium3/asami"
		},
		{
			title: "lated",
			description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Architecto rem earum doloribus atque temporibus veritatis cum aliquam inventore animi consequuntur ad reiciendis nisi asperiores, id laudantium repellendus, recusandae illo vitae?",
			tech: ["typescript", "reactjs"],
			slug: "https://github.com/quantinium3/lated"
		},
		{
			title: "shiro",
			description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Architecto rem earum doloribus atque temporibus veritatis cum aliquam inventore animi consequuntur ad reiciendis nisi asperiores, id laudantium repellendus, recusandae illo vitae?",
			tech: ["typescript", "reactjs"],
			slug: "https://github.com/quantinium3/shiro"
		},
		{
			title: "yumi",
			description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Architecto rem earum doloribus atque temporibus veritatis cum aliquam inventore animi consequuntur ad reiciendis nisi asperiores, id laudantium repellendus, recusandae illo vitae?",
			tech: ["typescript", "reactjs"],
			slug: "https://github.com/quantinium3/yumi"
		},
		{
			title: "comphub",
			description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Architecto rem earum doloribus atque temporibus veritatis cum aliquam inventore animi consequuntur ad reiciendis nisi asperiores, id laudantium repellendus, recusandae illo vitae?",
			tech: ["typescript", "reactjs"],
			slug: "https://github.com/quantinium3/comphub"
		},
		{
			title: "ryu",
			description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Architecto rem earum doloribus atque temporibus veritatis cum aliquam inventore animi consequuntur ad reiciendis nisi asperiores, id laudantium repellendus, recusandae illo vitae?",
			tech: ["typescript", "reactjs"],
			slug: "https://github.com/quantinium3/ryu"
		}
	]
</script>

<svelte:head>
	<title>{config.title}</title>
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
