<script lang="ts">
	import { resolve } from '$app/paths';
	import type { Solution, Category } from '$lib/solutions';

	let {
		solutions,
		categories,
		active = 'all'
	}: { solutions: Solution[]; categories: Category[]; active?: string } = $props();

	let query = $state('');

	const filtered = $derived(
		query.trim() === ''
			? solutions
			: solutions.filter((s) => {
					const q = query.toLowerCase();
					return (
						s.title?.toLowerCase().includes(q) ||
						s.description?.toLowerCase().includes(q) ||
						s.difficulty?.toLowerCase().includes(q) ||
						s.tags?.some((t: string) => t.toLowerCase().includes(q))
					);
				})
	);

	const tabClass = (isActive: boolean) =>
		`cursor-pointer border px-2 py-0.5 lowercase ${
			isActive
				? 'border-black bg-black text-white dark:border-zinc-300 dark:bg-zinc-300 dark:text-black'
				: 'border-black/40 opacity-70 hover:opacity-100 dark:border-zinc-400/40'
		}`;
</script>

<div class="py-4">
	<div class="mx-1 flex flex-wrap items-center justify-between gap-2">
		<h1 class="font-bold">
			DSA{active === 'all' ? '' : `/${active}`}
			<span class="text-sm font-normal opacity-70">({filtered.length})</span>
		</h1>
		<div class="flex flex-wrap items-center gap-2">
			<div class="flex flex-wrap gap-1 text-xs">
				<a href={resolve('/dsa')} class={tabClass(active === 'all')}>all</a>
				{#each categories as category (category.name)}
					<a href={resolve(`/dsa/${category.name}`)} class={tabClass(active === category.name)}>
						{category.name} ({category.count})
					</a>
				{/each}
			</div>
			<input
				type="search"
				placeholder="search..."
				bind:value={query}
				class="border border-black bg-transparent px-2 py-0.5 text-sm dark:border-zinc-400"
			/>
		</div>
	</div>

	{#if filtered.length === 0}
		<p class="mx-1 pt-4 text-sm opacity-50">no solutions found.</p>
	{:else}
		<div class="pt-4">
			{#each filtered as solution (solution.href)}
				<div class="py-2">
					<div class="min-w-0">
						<div class="flex flex-wrap items-baseline gap-2">
							<a
								href={resolve(`/dsa/${solution.category}/${solution.slug}`)}
								class="font-bold text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
								>[{solution.title}]</a
							>
							{#if active === 'all'}
								<span class="text-xs opacity-70">{solution.category}</span>
							{/if}
							{#if solution.difficulty}
								<span class="text-xs text-amber-600 dark:text-amber-400"
									>&lt;{solution.difficulty}&gt;</span
								>
							{/if}
							{#if solution.problemUrl}
								<a
									href={solution.problemUrl}
									target="_blank"
									rel="noopener noreferrer external"
									class="text-xs opacity-50 hover:opacity-100">(problem)</a
								>
							{/if}
						</div>
						<div class="mx-1 mt-0.5 flex items-center gap-2 text-xs opacity-70">
							<span
								>{Intl.DateTimeFormat('en-GB', {
									dateStyle: 'full'
								}).format(new Date(solution.date))}</span
							>
							<span>:</span>
							<span>{solution.readingTime} min read</span>
						</div>
						{#if solution.description}
							<p class="mx-1 my-2 text-sm opacity-90">{solution.description}</p>
						{/if}
						{#if solution.tags?.length}
							<div class="mx-1 mt-1 flex flex-wrap gap-1">
								{#each solution.tags as tag (tag)}
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
