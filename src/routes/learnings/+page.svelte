<script lang="ts">
	import { resolve } from '$app/paths';
	let { data } = $props();
	let query = $state('');

	const filtered = $derived(
		query.trim() === ''
			? data.learnings
			: data.learnings.filter((p) => {
					const q = query.toLowerCase();
					return (
						p.title?.toLowerCase().includes(q) ||
						p.description?.toLowerCase().includes(q) ||
						p.tags?.some((t: string) => t.toLowerCase().includes(q))
					);
				})
	);
</script>

<div class="py-4">
	<div class="mx-1 flex items-center justify-between">
		<h1 class="font-bold">
			Learnings <span class="text-sm font-normal opacity-70">({filtered.length})</span>
		</h1>
		<input
			type="search"
			placeholder="search..."
			bind:value={query}
			class="border border-black bg-transparent px-2 py-0.5 text-sm dark:border-zinc-400"
		/>
	</div>

	{#if filtered.length === 0}
		<p class="pt-4 text-sm opacity-50">no learnings found.</p>
	{:else}
		<div class="pt-4">
			{#each filtered as learning (learning.slug)}
				<div class="py-2">
					<div class="min-w-0">
						<a
							href={resolve(`/learnings/${learning.slug}`)}
							class="font-bold text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
							>[{learning.title}]</a
						>
						<div class="mx-1 mt-0.5 flex items-center gap-2 text-xs opacity-70">
							<span
								>{Intl.DateTimeFormat('en-GB', {
									dateStyle: 'full'
								}).format(new Date(learning.date))}</span
							>
							<span>:</span>
							<span>{learning.readingTime} min read</span>
						</div>
						{#if learning.description}
							<p class="mx-1 my-2 text-sm opacity-90">{learning.description}</p>
						{/if}
						{#if learning.tags?.length}
							<div class="mx-1 mt-1 flex flex-wrap gap-1">
								{#each learning.tags as tag (tag)}
									<span class="text-xs text-emerald-600 dark:text-emerald-400"
										>&lbrace;{tag}&rbrace;</span
									>
								{/each}
							</div>
						{/if}
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>
