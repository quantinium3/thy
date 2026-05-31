<script lang="ts">
	import { ChevronLeft, Copy, Check, X } from '@lucide/svelte';
	import { onMount, mount } from 'svelte';
	import { resolve } from '$app/paths';
	let { data } = $props();

	onMount(() => {
		document.querySelectorAll('.prose li input[type="checkbox"]').forEach((checkbox) => {
			const checked = (checkbox as HTMLInputElement).checked;
			const iconEl = document.createElement('span');
			iconEl.className = 'task-icon';
			mount(checked ? Check : X, {
				target: iconEl,
				props: { size: 15, class: checked ? 'task-done' : 'task-todo' }
			});
			checkbox.replaceWith(iconEl);
		});

		document.querySelectorAll('.prose pre').forEach((pre) => {
			(pre as HTMLElement).style.position = 'relative';

			const btn = document.createElement('button');
			btn.className = 'copy-btn';

			const iconEl = document.createElement('span');
			mount(Copy, { target: iconEl, props: { size: 14 } });
			btn.appendChild(iconEl);

			btn.addEventListener('click', async () => {
				const code = pre.querySelector('code')?.innerText ?? '';
				await navigator.clipboard.writeText(code);
				iconEl.innerHTML = '';
				mount(Check, { target: iconEl, props: { size: 14 } });
				setTimeout(() => {
					iconEl.innerHTML = '';
					mount(Copy, { target: iconEl, props: { size: 14 } });
				}, 2000);
			});

			pre.appendChild(btn);
		});
	});
</script>

<article class="py-4">
	<a
		href={resolve('/blog')}
		class="mb-4 inline-flex items-center gap-0.5 text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
	>
		<span class="flex items-center"><ChevronLeft size={14} /></span>[/blog]
	</a>

	<div class="mb-6 border-b pb-4 dark:border-zinc-400">
		<h1 class="font-bold">{data.title}</h1>
		<p class="mt-1 text-xs opacity-70">
			{Intl.DateTimeFormat('en-GB', {
				dateStyle: 'full'
			}).format(new Date(data.date))}
		</p>
		{#if data.description}
			<p class="my-2 text-sm opacity-90">{data.description}</p>
		{/if}
		{#if data.tags.length}
			<div class="mt-2 flex gap-2">
				{#each data.tags as tag (tag)}
					<span class="text-xs text-emerald-600 dark:text-emerald-400">&lbrace;{tag}&rbrace;</span>
				{/each}
			</div>
		{/if}
	</div>

	<div class="prose">
		<data.content />
	</div>
</article>

<style>
	.prose :global(h1),
	.prose :global(h2),
	.prose :global(h3),
	.prose :global(h4),
	.prose :global(h5),
	.prose :global(h6) {
		font-weight: bold;
		font-size: 1rem;
		margin-top: 1.5rem;
		margin-bottom: 0.5rem;
	}
	.prose :global(h1)::before {
		content: '# ';
		opacity: 0.4;
	}
	.prose :global(h2)::before {
		content: '## ';
		opacity: 0.4;
	}
	.prose :global(h3)::before {
		content: '### ';
		opacity: 0.4;
	}
	.prose :global(h4)::before {
		content: '#### ';
		opacity: 0.4;
	}
	.prose :global(h5)::before {
		content: '##### ';
		opacity: 0.4;
	}
	.prose :global(h6)::before {
		content: '###### ';
		opacity: 0.4;
	}
	.prose :global(p) {
		margin-bottom: 1rem;
		line-height: 1.7;
	}
	.prose :global(ul),
	.prose :global(ol) {
		padding-left: 1.5rem;
		margin-bottom: 1rem;
	}
	.prose :global(ol) {
		margin-left: 0.75rem;
	}
	.prose :global(li) {
		margin-bottom: 0.25rem;
	}
	.prose :global(.task-icon) {
		display: inline-flex;
		align-items: center;
		vertical-align: middle;
		margin-right: 0.35rem;
	}
	.prose :global(.task-done) {
		color: #16a34a;
	}
	.prose :global(.task-todo) {
		color: #dc2626;
	}
	:global(html.dark) .prose :global(.task-done) {
		color: #4ade80;
	}
	:global(html.dark) .prose :global(.task-todo) {
		color: #f87171;
	}
	.prose :global(ul) {
		list-style-type: disc;
	}
	.prose :global(ol) {
		list-style-type: decimal;
	}
	.prose :global(code) {
		font-family: 'Menlo', monospace;
		font-size: 0.875rem;
	}
	.prose :global(:not(pre) > code) {
		background-color: rgba(0, 0, 0, 0.08);
		border-radius: 0.25rem;
		padding: 0.1rem 0.35rem;
	}
	:global(html.dark) .prose :global(:not(pre) > code) {
		background-color: rgba(255, 255, 255, 0.12);
	}
	.prose :global(pre) {
		margin-bottom: 1rem;
		overflow-x: auto;
		border-radius: 0.375rem;
	}
	.prose :global(.shiki) {
		padding: 1rem;
	}
	.prose :global(.copy-btn) {
		position: absolute;
		top: 0.5rem;
		right: 0.5rem;
		padding: 0.25rem;
		opacity: 0;
		transition: opacity 0.15s;
		cursor: pointer;
		border-radius: 0.25rem;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.prose :global(pre:hover .copy-btn) {
		opacity: 0.6;
	}
	.prose :global(.copy-btn:hover) {
		opacity: 1 !important;
	}
	/* shiki dual-theme: show light by default, dark when .dark is on <html> */
	:global(html:not(.dark)) .prose :global(.shiki) {
		background-color: #f4f4f5 !important;
	}
	:global(html.dark) .prose :global(.shiki) {
		background-color: #242424 !important;
	}
	:global(html.dark) .prose :global(.shiki span) {
		color: var(--shiki-dark) !important;
	}
	.prose :global(table) {
		width: 100%;
		border-collapse: collapse;
		font-size: 0.875rem;
	}
	.prose :global(table) {
		display: block;
		overflow-x: auto;
		margin-bottom: 1rem;
		scrollbar-width: thin;
		scrollbar-color: rgba(128, 128, 128, 0.4) transparent;
	}
	.prose :global(table::-webkit-scrollbar) {
		height: 4px;
	}
	.prose :global(table::-webkit-scrollbar-track) {
		background: transparent;
	}
	.prose :global(table::-webkit-scrollbar-thumb) {
		background-color: rgba(128, 128, 128, 0.4);
		border-radius: 9999px;
	}
	.prose :global(table::-webkit-scrollbar-thumb:hover) {
		background-color: rgba(128, 128, 128, 0.7);
	}
	.prose :global(thead) {
		border-bottom: 2px solid;
		opacity: 1;
	}
	.prose :global(th) {
		text-align: left;
		font-weight: bold;
		padding: 0.5rem 0.75rem;
	}
	.prose :global(td) {
		padding: 0.5rem 0.75rem;
		border-bottom: 1px solid rgba(128, 128, 128, 0.2);
	}
	.prose :global(tr:last-child td) {
		border-bottom: none;
	}
	.prose :global(tr:hover td) {
		background-color: rgba(128, 128, 128, 0.06);
	}

	.prose :global(a) {
		color: #2563eb;
		text-decoration: underline;
	}
	.prose :global(a)::before {
		content: '[';
		opacity: 0.6;
	}
	.prose :global(a)::after {
		content: ']';
		opacity: 0.6;
	}
	.prose :global(a:hover) {
		color: #1d4ed8;
	}
	:global(html.dark) .prose :global(a) {
		color: #60a5fa;
	}
	:global(html.dark) .prose :global(a:hover) {
		color: #93c5fd;
	}
	.prose :global(blockquote) {
		border-left: 2px solid;
		padding-left: 1rem;
		opacity: 0.7;
		margin-bottom: 1rem;
	}
	.prose :global(mark) {
		background: none;
		color: inherit;
		border: 1px solid currentColor;
		border-radius: 0.2rem;
		padding: 0 0.2rem;
	}
	.prose :global(details) {
		border: 1px solid rgba(128, 128, 128, 0.3);
		border-radius: 0.375rem;
		padding: 0.4rem 0.6rem 0.2rem;
		margin-bottom: 1rem;
	}
	.prose :global(summary) {
		cursor: pointer;
		font-weight: bold;
		list-style: none;
		display: flex;
		align-items: center;
		gap: 0.5rem;
		user-select: none;
	}
	.prose :global(summary)::before {
		content: '▸';
		font-size: 0.75rem;
		transition: transform 0.2s;
		display: inline-block;
		opacity: 0.5;
	}
	.prose :global(details[open] summary)::before {
		transform: rotate(90deg);
	}
	.prose :global(details[open] summary) {
		margin-bottom: 0.4rem;
	}
	.prose :global(details[open]) {
		border-color: rgba(128, 128, 128, 0.5);
	}

	:global(html) {
		scrollbar-width: thin;
		scrollbar-color: rgba(128, 128, 128, 0.35) transparent;
	}
	:global(html::-webkit-scrollbar) {
		width: 5px;
	}
	:global(html::-webkit-scrollbar-track) {
		background: transparent;
	}
	:global(html::-webkit-scrollbar-thumb) {
		background-color: rgba(128, 128, 128, 0.35);
		border-radius: 9999px;
	}
	:global(html::-webkit-scrollbar-thumb:hover) {
		background-color: rgba(128, 128, 128, 0.6);
	}
</style>
