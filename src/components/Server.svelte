<script>
	import axios from 'axios';
	import { onMount } from 'svelte';

	let quantinium = $state('Ok');
	let proxy = $state('Ok');
	let natsuki = $state('Ok');
	let lucy = $state('Ok');
	let git = $state('Ok');

	onMount(async () => {
		const quantiniumReq = axios.get('https://lucy.quantinium.dev/api/ping/', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			data: { hostname: 'quantinium.dev', port: 80, timeout: 1000 }
		});

		const proxyReq = axios.get('https://lucy.quantinium.dev/api/ping/', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			data: { hostname: 'nginx.quantinium.dev', port: 80, timeout: 1000 }
		});

		const natsukiReq = axios.get('https://lucy.quantinium.dev/api/ping/', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			data: { hostname: 'natsuki.quantinium.dev', port: 80, timeout: 1000 }
		});

		const lucyReq = axios.get('https://lucy.quantinium.dev/api/ping/', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			data: { hostname: 'lucy.quantinium.dev', port: 80, timeout: 1000 }
		});

		const gitReq = axios.get('https://lucy.quantinium.dev/api/ping/', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			data: { hostname: 'github.com', port: 80, timeout: 1000 }
		});

		axios.all([quantiniumReq, proxyReq, natsukiReq, lucyReq, gitReq]).then(
			axios.spread((quantiniumRes, proxyRes, natsukiRes, lucyRes, gitRes) => {
				quantinium = quantiniumRes.status;
				proxy = proxyRes.status;
				natsuki = natsukiRes.status;
				lucy = lucyRes.status;
				git = gitRes.status;
			})
		);
	});
</script>

<div class="mb-3 text-xl font-bold">System Status: Ok</div>
<div class="grid grid-cols-2">
	<div class="flex gap-3"><span>[ {quantinium} ]</span><span>quantinium.dev</span></div>
	<div class="flex gap-3"><span>[ {proxy} ]</span><span>proxy</span></div>
	<div class="flex gap-3"><span>[ {natsuki} ]</span><span>mitsuki</span></div>
	<div class="flex gap-3"><span>[ {lucy} ]</span><span>lucy</span></div>
	<div class="flex gap-3"><span>[ {git} ]</span><span>git</span></div>
</div>
