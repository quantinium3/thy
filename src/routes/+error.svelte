<script>
	import { page } from '$app/state';
</script>

<div class="error mt-[4rem] flex gap-3 flex-col justify-center">
	<img src="/frieren-dies.gif" alt="frieren dies" class="w-sm"/>
	<h1 class="text-xl font-bold text-center">{page.status}: {page.error?.message}</h1>
</div>

<style>
	.error {
		height: 100%;
		display: grid;
		place-content: center;
	}
</style>
