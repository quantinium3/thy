<script lang="ts">
	import { formatDate } from '$lib/utils';
	let { project } = $props();
</script>

<div class="py-9 border-b border-dashed flex flex-col">
	<div class="mb-1">
		<h1
			class="font-semibold text-xl"><a href={project.slug}
																			 class="link-animate text-[#cc241d] dark:text-[#fb4934] dark:hover:border-b-white">{project.title}</a></h1>
	</div>
	{#if project.image}
		<img src={project.image} alt={project.title} />
	{/if}
	<div class="flex gap-3">
		{#each project.tech as tech (tech)}
			<span class="text-xs">#{tech.replaceAll("_", " ")}</span>
		{/each}
	</div>

	<div class="text-sm mt-3">{project.description}</div>
</div>


<style>
    .link-animate	{
        position: relative;
        text-decoration: none;
        padding-bottom: 3px;
    }

    .link-animate:hover {
        right: 0;
        text-decoration: none;
    }

    .link-animate:hover:after {
        right: 0;
    }

    .link-animate:after {
        border-radius: 1em;
        border-top: .1em solid;
        content: "";
        position: absolute;
        right: 100%;
        bottom: .14em;
        left: 0;
        transition: right .4s cubic-bezier(0,.5,0,1),
        border-color .4s ease-out;
    }

    .link-animate:hover:after {
        right: 0;
    }
</style>
