<script lang="ts">
	import { projects } from '$lib/projects';

	let query = $state('');

	const statusColor: Record<string, string> = {
		active: 'text-emerald-600 dark:text-emerald-400',
		finished: 'text-blue-600 dark:text-blue-400',
		wip: 'text-amber-600 dark:text-amber-400',
		abandoned: 'text-zinc-400 dark:text-zinc-500'
	};

	const filtered = $derived(
		query.trim() === ''
			? projects
			: projects.filter((p) => {
					const q = query.toLowerCase();
					return (
						p.name.toLowerCase().includes(q) ||
						p.description.toLowerCase().includes(q) ||
						p.tags.some((t) => t.toLowerCase().includes(q))
					);
				})
	);
</script>

<div class="py-4">
	<div class="mx-1 flex items-center justify-between">
		<h1 class="font-bold">
			Projects <span class="text-sm font-normal opacity-70">({filtered.length})</span>
		</h1>
		<input
			type="search"
			placeholder="search..."
			bind:value={query}
			class="border border-black bg-transparent px-2 py-0.5 text-sm dark:border-zinc-400"
		/>
	</div>

	{#if filtered.length === 0}
		<p class="pt-4 text-sm opacity-50">no projects found.</p>
	{:else}
		<div class="grid grid-cols-2 gap-4 pt-4">
			{#each filtered as project (project.name)}
				<div class="flex flex-col gap-2">
					{#if project.image}
						<img src={project.image} alt={project.name} class="aspect-video w-full object-cover" />
					{/if}
					<div class="flex flex-col gap-1">
						<div class="flex flex-wrap items-baseline gap-3">
							{#if project.repo}
								<a
									href={project.repo}
									target="_blank"
									rel="noopener noreferrer external"
									class="font-bold text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
								>
									[{project.name}]
								</a>
							{:else}
								<span class="font-bold">[{project.name}]</span>
							{/if}
							<span class="text-xs {statusColor[project.status]}">{project.status}</span>
						</div>
						<p class="text-sm opacity-80">{project.description}</p>
						<div class="flex flex-wrap gap-1">
							{#each project.tags as tag (tag)}
								<span class="text-xs text-emerald-600 dark:text-emerald-400"
									>&lbrace;{tag}&rbrace;</span
								>
							{/each}
						</div>
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>
