<script lang="ts">
	import { onMount } from 'svelte';

	let totalTime = $state(0);
	let loading = $state(true);
	let error = $state(false);

	onMount(async () => {
		try {
			const timeUri = import.meta.env.VITE_TIME_URI;
			if (!timeUri) throw new Error('VITE_TIME_URI is not set');

			const res = await fetch(timeUri);
			const data = (await res.json()) as { data: Array<{ grand_total: { decimal: string } }> };
			totalTime = data.data.reduce(
				(acc: number, day: { grand_total: { decimal: string } }) =>
					acc + parseFloat(day.grand_total.decimal),
				0
			);
		} catch (err) {
			console.error('failed to fetch wakatime stats', err);
			error = true;
		} finally {
			loading = false;
		}
	});
</script>

<div class="mt-3">
	<span class="block pb-1 font-bold">Stats (weekly)</span>
	<div class="space-y-0.5 text-sm">
		<div>
			<span class="opacity-70">*</span> total - {loading
				? '...'
				: error
					? 'n/a'
					: `${totalTime.toFixed(2)} hr`}
		</div>
		<div>
			<span class="opacity-70">*</span> daily avg - {loading
				? '...'
				: error
					? 'n/a'
					: `${(totalTime / 7).toFixed(2)} hr`}
		</div>
		<div>
			<span class="opacity-70">*</span> editor -
			<a href="https://helix-editor.com/" class="text-blue-700 dark:text-blue-400">[helix]</a>
		</div>
		<div>
			<span class="opacity-70">*</span> os -
			<a href="https://fedoraproject.org/" class="text-blue-700 dark:text-blue-400">[fedora]</a>
		</div>
		<div>
			<span class="opacity-70">*</span> current -
			<a href="https://github.com/quantinium3" class="text-blue-700 dark:text-blue-400">[lyra]</a>
		</div>
	</div>
</div>
