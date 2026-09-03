<script lang="ts">
	import Moon from '@lucide/svelte/icons/moon';
	import Sun from '@lucide/svelte/icons/sun';
	import { onMount } from 'svelte';
	import { fly } from 'svelte/transition';

	let isDark = $state(false);

	onMount(() => {
		isDark = localStorage.getItem('theme') === 'dark';
	});

	function toggle() {
		isDark = !isDark;
		if (isDark) {
			document.documentElement.classList.add('dark');
			localStorage.setItem('theme', 'dark');
		} else {
			document.documentElement.classList.remove('dark');
			localStorage.setItem('theme', 'light');
		}
	}
</script>

<button onclick={toggle} aria-label="Toggle theme" class="flex cursor-pointer items-center gap-0.5">
	<span>[</span>
	<span class="relative block h-5 w-4 overflow-hidden">
		{#if isDark}
			<span
				class="absolute inset-0 flex items-center justify-center"
				in:fly={{ y: -20, duration: 200 }}
				out:fly={{ y: 20, duration: 200 }}
			>
				<Sun size={14} />
			</span>
		{:else}
			<span
				class="absolute inset-0 flex items-center justify-center"
				in:fly={{ y: -20, duration: 200 }}
				out:fly={{ y: 20, duration: 200 }}
			>
				<Moon size={14} />
			</span>
		{/if}
	</span>
	<span>]</span>
</button>
