<script lang="ts">
	import { recommended, yetToConsume, kindCategory, type Media, type MediaCategory } from '$lib/media';

	let query = $state('');
	let category = $state<MediaCategory | 'all'>('all');

	const categories: (MediaCategory | 'all')[] = ['all', 'watch', 'play', 'read'];

	const kindColor: Record<string, string> = {
		movie: 'text-blue-600 dark:text-blue-400',
		anime: 'text-emerald-600 dark:text-emerald-400',
		game: 'text-amber-600 dark:text-amber-400',
		show: 'text-purple-600 dark:text-purple-400',
		book: 'text-zinc-500 dark:text-zinc-400',
		manga: 'text-zinc-500 dark:text-zinc-400',
		manhwa: 'text-zinc-500 dark:text-zinc-400'
	};

	function filter(items: Media[]) {
		const q = query.trim().toLowerCase();
		return items.filter((m) => {
			const matchesQuery =
				q === '' || m.name.toLowerCase().includes(q) || m.kind.toLowerCase().includes(q);
			const matchesCategory = category === 'all' || kindCategory[m.kind] === category;
			return matchesQuery && matchesCategory;
		});
	}

	const filteredRecommended = $derived(filter(recommended));
	const filteredYetToConsume = $derived(filter(yetToConsume));
</script>

{#snippet grid(items: Media[])}
	{#if items.length === 0}
		<p class="pt-2 text-sm opacity-50">nothing here.</p>
	{:else}
		<div class="grid grid-cols-2 gap-4 pt-2 sm:grid-cols-3 md:grid-cols-5">
			{#each items as item (item.name)}
				{#snippet card()}
					<div class="relative aspect-2/3 w-full overflow-hidden bg-zinc-200 dark:bg-zinc-800">
						{#if item.image}
							<img src={item.image} alt={item.name} class="h-full w-full object-cover" />
						{:else}
							<div class="flex h-full w-full items-center justify-center p-2 text-center text-xs opacity-50">
								{item.name}
							</div>
						{/if}
						<div
							class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent px-2 pt-6 pb-1.5"
						>
							<span class="block text-[10px] uppercase {kindColor[item.kind]}">{item.kind}</span>
							<span class="block truncate text-xs font-bold text-white">{item.name}</span>
						</div>
					</div>
				{/snippet}
				{#if item.url}
					<a href={item.url} target="_blank" rel="noopener noreferrer external" class="block">
						{@render card()}
					</a>
				{:else}
					{@render card()}
				{/if}
			{/each}
		</div>
	{/if}
{/snippet}

<div class="flex flex-col gap-8 py-4">
	<div class="mx-1 flex flex-wrap items-center justify-between gap-2">
		<h1 class="font-bold">Media</h1>
		<div class="flex items-center gap-2">
			<div class="flex gap-1 text-xs">
				{#each categories as c (c)}
					<button
						onclick={() => (category = c)}
						class="cursor-pointer border px-2 py-0.5 capitalize {category === c
							? 'border-black bg-black text-white dark:border-zinc-300 dark:bg-zinc-300 dark:text-black'
							: 'border-black/40 opacity-70 hover:opacity-100 dark:border-zinc-400/40'}"
					>
						{c}
					</button>
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

	<section>
		<h2 class="mx-1 font-bold">
			Recommended <span class="text-sm font-normal opacity-70">({filteredRecommended.length})</span>
		</h2>
		{@render grid(filteredRecommended)}
	</section>

	<section>
		<h2 class="mx-1 font-bold">
			Yet to Consume <span class="text-sm font-normal opacity-70">({filteredYetToConsume.length})</span
			>
		</h2>
		{@render grid(filteredYetToConsume)}
	</section>
</div>
