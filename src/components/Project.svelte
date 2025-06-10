<script lang="ts">
	import { formatDate } from '$lib/utils';
	let { project } = $props();
</script>

<div class="py-9 border-b border-dashed flex flex-col gap-5">
	<div class="" >
		<h1
			class="font-semibold text-lg"><a href={project.slug}
																			 class="link-animate text-[#cc241d] dark:text-[#fb4934] dark:hover:border-b-white">{project.title}</a></h1>
		<p
			class="text-xs dark:text-zinc-100 text-zinc-900">{formatDate(blog.date)}</p>
	</div>
	<img src={project.image} alt={project.title} />
	<div class="flex gap-3">
		{#each project.tech as tech (tech)}
			<span class="text-xs">#{tech.replaceAll("_", " ")}</span>
		{/each}
	</div>

	<div class="text-sm">{project.description}</div>
	<div><a href="/project/{project.slug}"
					class="hover:underline underline-offset-2 hover:font-semibold">read
		more...</a></div>
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
