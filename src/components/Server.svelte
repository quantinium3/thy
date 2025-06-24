<script>
	import axios from 'axios';
	import { onMount } from 'svelte';

	let quantinium = $state('...');
	let proxy = $state('...');
	let natsuki = $state('...');
	let lucy = $state('...');
	let git = $state('...');

	onMount(async () => {
		try {
			const [quantiniumRes, proxyRes, natsukiRes, lucyRes, gitRes] = await Promise.all([
				axios.post(
					'https://lucy.quantinium.dev/api/ping/',
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
					'https://lucy.quantinium.dev/api/ping/',
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
					'https://lucy.quantinium.dev/api/ping/',
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
					'https://lucy.quantinium.dev/api/ping/',
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
					'https://lucy.quantinium.dev/api/ping/',
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
			natsuki = natsukiRes.data.status;
			lucy = lucyRes.data.status;
			git = gitRes.data.status;
		} catch (error) {
			console.error('Error fetching system statuses:', error);
			quantinium = 'Err';
			proxy = 'Err';
			natsuki = 'Err';
			lucy = 'Err';
			git = 'Err';
		}
	});
</script>

<div class="mb-3 text-xl font-bold">System Status: Ok</div>
<div class="grid grid-cols-2">
	<div class="flex gap-3"><span>[ {quantinium} ]</span><span>site</span></div>
	<div class="flex gap-3"><span>[ {proxy} ]</span><span>proxy</span></div>
	<div class="flex gap-3"><span>[ {natsuki} ]</span><span>mitsuki</span></div>
	<div class="flex gap-3"><span>[ {lucy} ]</span><span>lucy</span></div>
	<div class="flex gap-3"><span>[ {git} ]</span><span>git</span></div>
</div>
