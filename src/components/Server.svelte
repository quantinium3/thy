<script>
	import axios from 'axios';
	import { onMount } from 'svelte';

	let quantinium = $state('...');
	let proxy = $state('...');
	let nixie = $state('...');
	let lucy = $state('...');
	let git = $state('...');
	let system = $state('...');

	onMount(async () => {
		try {
			const [quantiniumRes, proxyRes, natsukiRes, lucyRes, gitRes] = await Promise.all([
				axios.post(
					import.meta.env.VITE_PING_URI,
					{
						hostname: 'quantinium.dev',
						port: 80,
						timeout: 1000
					},
					{
						headers: { 'Content-Type': 'application/json' }
					}
				),
				axios.post(
					import.meta.env.VITE_PING_URI,
					{
						hostname: 'nginx.quantinium.dev',
						port: 80,
						timeout: 1000
					},
					{
						headers: { 'Content-Type': 'application/json' }
					}
				),
				axios.post(
					import.meta.env.VITE_PING_URI,
					{
						hostname: 'natsuki.quantinium.dev',
						port: 80,
						timeout: 1000
					},
					{
						headers: { 'Content-Type': 'application/json' }
					}
				),
				axios.post(
					import.meta.env.VITE_PING_URI,
					{
						hostname: 'lucy.quantinium.dev',
						port: 80,
						timeout: 1000
					},
					{
						headers: { 'Content-Type': 'application/json' }
					}
				),
				axios.post(
					import.meta.env.VITE_PING_URI,
					{
						hostname: 'github.com',
						port: 80,
						timeout: 1000
					},
					{
						headers: { 'Content-Type': 'application/json' }
					}
				)
			]);

			quantinium = quantiniumRes.data.status;
			proxy = proxyRes.data.status;
			nixie = natsukiRes.data.status;
			lucy = lucyRes.data.status;
			git = gitRes.data.status;
			if (quantinium == 'Ok' && proxy == 'Ok' && nixie == 'Ok' && lucy == 'Ok' && git == 'Ok') {
				system = 'Ok';
			} else {
				system = 'Err';
			}
		} catch (error) {
			console.error('Error fetching system statuses:', error);
			quantinium = 'Err';
			proxy = 'Err';
			nixie = 'Err';
			lucy = 'Err';
			git = 'Err';
		}
	});
</script>

<div class="mb-3 text-xl font-bold">
	System Status:
	<span class={system == 'Ok' ? 'text-green-500' : 'text-red-500'}>{system}</span>
</div>
<div class="grid grid-cols-2">
	<div class="flex gap-2">
		[<span class={quantinium == 'Ok' ? 'text-green-500' : 'text-red-500'}>
			{quantinium}
		</span>]<span>site</span>
	</div>
	<div class="flex gap-2">
		[<span class={proxy == 'Ok' ? 'text-green-500' : 'text-red-500'}>{proxy}</span>]<span
			>proxy</span
		>
	</div>
	<div class="flex gap-2">
		[<span class={nixie == 'Ok' ? 'text-green-500' : 'text-red-500'}>{nixie}</span>]<span
			>mitsuki</span
		>
	</div>
	<div class="flex gap-2">
		[<span class={lucy == 'Ok' ? 'text-green-500' : 'text-red-500'}>{lucy}</span>]<span>lucy</span>
	</div>
	<div class="flex gap-2">
		[<span class={git == 'Ok' ? 'text-green-500' : 'text-red-500'}>{git}</span>]<span>git</span>
	</div>
</div>
