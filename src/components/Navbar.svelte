<script>
	import { fly } from 'svelte/transition';
	import { Moon, Sun } from '@lucide/svelte';
	import { theme } from '$lib/theme.svelte';
</script>

<div class="dark:text-white flex justify-between max-w-4xl mx-auto text-xl py-3 border-b border-dashed px-3">
	<div>&gt; quant</div>
	<div>
		<button onclick={theme.toggle} aria-label="Toggle theme">
			{#if theme.current === 'dark'}
				<div in:fly={{ y: 10 }}>
					<Sun />
				</div>
			{:else}
				<div in:fly={{ y: -10 }}>
					<Moon />
				</div>
			{/if}
		</button>
	</div>
</div>
