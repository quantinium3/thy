<script lang="ts">
	import * as config from '$lib/config';
</script>

<svelte:head>
	<title>{config.title}</title>
</svelte:head>

<div class="flex justify-between flex-col min-h-[90vh] md:min-h-[93.5vh]">
<div class="flex items-center justify-center flex-col mt-3 md:mt-9 login">
	<img src="/login.png" class="w-72"  alt="lain"/>
		<h1 class="mt-3 md:pt-12 font-bold py-5 text-xl">Login</h1>
		<div class="flex flex-col gap-3">
			<form method="POST" action="#" class="flex flex-col gap-3">
				<label>
					username
					<input name="username" type="text"
								 class="border dark:border-white border-black rounded-md px-1" />
				</label>
				<label>
					password
					<input name="password" type="password"
								 class="border dark:border-white border-black rounded-md px-1"/>
				</label>
				<button formaction="#"
								class="rounded-md border dark:border-white p-1">log
					in</button>
			</form>
		</div>
</div>

</div>