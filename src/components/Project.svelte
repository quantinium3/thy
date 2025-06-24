<script lang="ts">
	import { formatDate } from '$lib/utils';
	let { project } = $props();
</script>

<div class="flex flex-col border-b border-dashed py-9">
	<div class="mb-1">
		<h1 class="text-xl font-semibold">
			<a
				href={project.slug}
				class="link-animate text-[#cc241d] dark:text-[#fe8019] dark:hover:border-b-white"
				>{project.title}</a
			>
		</h1>
	</div>
	{#if project.image}
		<img src={project.image} alt={project.title} />
	{/if}
	<div class="flex gap-3">
		{#each project.tech as tech (tech)}
			<span class="text-xs">#{tech.replaceAll('_', ' ')}</span>
		{/each}
	</div>

	<div class="mt-3 text-sm">{project.description}</div>
</div>

<style>
	.link-animate {
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
		border-top: 0.1em solid;
		content: '';
		position: absolute;
		right: 100%;
		bottom: 0.14em;
		left: 0;
		transition:
			right 0.4s cubic-bezier(0, 0.5, 0, 1),
			border-color 0.4s ease-out;
	}

	.link-animate:hover:after {
		right: 0;
	}
</style>
