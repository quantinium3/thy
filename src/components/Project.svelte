<script lang="ts">
	let { project } = $props();
</script>

<div class="flex flex-col border-b border-dashed py-9">
	<div class="mb-1">
		<h1 class="text-xl font-semibold">
			<a
				href={project.slug}
				class="text-[#cc241d] hover:underline hover:underline-offset-2 dark:text-[#fe8019] dark:hover:border-b-white"
				>{project.title}</a
			>
		</h1>
	</div>
	{#if project.image}
		<img src={project.image} alt={project.title} />
	{/if}
	<div class="flex gap-3">
		<span class="text-xs">{project.tech.join(',')}</span>
		<!-- {#each project.tech as tech (tech)}
			<span class="text-xs">{tech.replaceAll('_', ' ')}</span>
		{/each} -->
	</div>

	<div class="mt-3 text-sm">{project.description}</div>
</div>
