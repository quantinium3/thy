<script lang="ts">
	import { bookmarks, categories, groupByCategory, hostname } from '$lib/bookmarks';
	import Seo from '$lib/components/seo.svelte';

	let query = $state('');
	let category = $state<string>('all');

	const tabs = ['all', ...categories];

	const filtered = $derived.by(() => {
		const q = query.trim().toLowerCase();
		return bookmarks.filter((b) => {
			const matchesQuery =
				q === '' ||
				b.title.toLowerCase().includes(q) ||
				b.category.toLowerCase().includes(q) ||
				b.url.toLowerCase().includes(q) ||
				(b.description?.toLowerCase().includes(q) ?? false);
			const matchesCategory = category === 'all' || b.category === category;
			return matchesQuery && matchesCategory;
		});
	});

	const grouped = $derived(groupByCategory(filtered));
</script>

<Seo
	title="Bookmarks"
	description="Links, blogs, books and tools quantinium keeps coming back to."
/>

<div class="py-4">
	<div class="mx-1 flex flex-wrap items-center justify-between gap-2">
		<h1 class="font-bold">
			Bookmarks <span class="text-sm font-normal opacity-70">({filtered.length})</span>
		</h1>
		<div class="flex flex-wrap items-center gap-2">
			<div class="flex flex-wrap gap-1 text-xs">
				{#each tabs as c (c)}
					<button
						onclick={() => (category = c)}
						class="cursor-pointer border px-2 py-0.5 lowercase {category === c
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

	{#if grouped.length === 0}
		<p class="mx-1 pt-4 text-sm opacity-50">no bookmarks found.</p>
	{:else}
		<div class="flex flex-col gap-6 pt-4">
			{#each grouped as [name, items] (name)}
				<section>
					<h2 class="mx-1 font-bold">
						{name} <span class="text-sm font-normal opacity-70">({items.length})</span>
					</h2>
					<div class="space-y-2 pt-2">
						{#each items as bookmark (bookmark.url)}
							<div class="space-y-0.5">
								<div class="flex flex-wrap items-baseline gap-2">
									<a
										href={bookmark.url}
										target="_blank"
										rel="noopener noreferrer external"
										class="font-bold text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
										>[{bookmark.title}]</a
									>
									<span class="text-xs opacity-50">{hostname(bookmark.url)}</span>
								</div>
								{#if bookmark.description}
									<p class="pl-1 text-sm opacity-80">{bookmark.description}</p>
								{/if}
							</div>
						{/each}
					</div>
				</section>
			{/each}
		</div>
	{/if}
</div>
