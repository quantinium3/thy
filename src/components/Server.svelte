<script>
	import axios from 'axios';
	import { onMount } from 'svelte';

	const servicesConfig = [
		{ id: 'quantinium', name: 'site', hostname: 'quantinium.dev' },
		{ id: 'proxy', name: 'proxy', hostname: 'gitlab.com' },
		{ id: 'nixie', name: 'nixie', hostname: 'nixie.quantinium.dev' },
		{ id: 'git', name: 'git', hostname: 'github.com' }
	];

	let statuses = $state(servicesConfig.reduce((acc, s) => ({ ...acc, [s.id]: '...' }), {}));
	let systemStatus = $state('...');

	const PING_URI = `${import.meta.env.VITE_NIXIE_URI}/api/ping`;

	onMount(async () => {
		try {
			const requests = servicesConfig.map((s) =>
				axios.post(PING_URI, {
					hostname: s.hostname,
					port: 80,
					timeout: 1000
				})
			);

			const results = await Promise.all(requests);

			results.forEach((res, index) => {
				const serviceId = servicesConfig[index].id;
				statuses[serviceId] = res.data.status;
			});

			const allOk = Object.values(statuses).every((s) => s === 'Ok');
			systemStatus = allOk ? 'Ok' : 'Err';
		} catch (error) {
			console.error('Error fetching system statuses:', error);
			Object.keys(statuses).forEach((key) => (statuses[key] = 'Err'));
			systemStatus = 'Err';
		}
	});
</script>

<div class="mb-3 text-xl font-bold">
	System Status:
	<span class={systemStatus === 'Ok' ? 'text-green-500' : 'text-red-500'}>
		{systemStatus}
	</span>
</div>

<div class="grid grid-cols-2 gap-y-1">
	{#each servicesConfig as service (service.id)}
		<div class="flex gap-2">
			[<span class={statuses[service.id] === 'Ok' ? 'text-green-500' : 'text-red-500'}>
				{statuses[service.id]}
			</span>]
			<span>{service.name}</span>
		</div>
	{/each}
</div>
