<script lang="ts">
	import { media } from '$lib/media';

	let query = $state('');

	const kindColor: Record<string, string> = {
		movie: 'text-blue-600 dark:text-blue-400',
		anime: 'text-emerald-600 dark:text-emerald-400',
		game: 'text-amber-600 dark:text-amber-400',
		show: 'text-purple-600 dark:text-purple-400',
		book: 'text-zinc-500 dark:text-zinc-400'
	};

	const filtered = $derived(
		query.trim() === ''
			? media
			: media.filter((m) => {
					const q = query.toLowerCase();
					return m.name.toLowerCase().includes(q) || m.kind.toLowerCase().includes(q);
				})
	);
</script>

<div class="py-4">
	<div class="mx-1 flex items-center justify-between">
		<h1 class="font-bold">
			Media <span class="text-sm font-normal opacity-70">({filtered.length})</span>
		</h1>
		<input
			type="search"
			placeholder="search..."
			bind:value={query}
			class="border border-black bg-transparent px-2 py-0.5 text-sm dark:border-zinc-400"
		/>
	</div>

	{#if filtered.length === 0}
		<p class="pt-4 text-sm opacity-50">no media found.</p>
	{:else}
		<div class="grid grid-cols-2 gap-4 pt-4 sm:grid-cols-3">
			{#each filtered as item (item.name)}
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
</div>
