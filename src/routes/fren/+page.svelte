<script lang="ts">
	import * as config from '$lib/config';
	import { fly } from 'svelte/transition';
	import { Moon, Sun } from '@lucide/svelte';
	import { theme } from '$lib/theme.svelte';

	let links = [
		{
			name: 'home',
			href: '/'
		},
		{
			name: 'blog',
			href: '/blog'
		},
		{
			name: 'projects',
			href: '/project'
		},
		{
			name: 'guides',
			href: '/guide'
		},
		{
			name: 'resources',
			href: '/resource'
		},
		{
			name: 'frens',
			href: '/fren'
		},
		{
			name: 'login',
			href: '/login'
		}
	];
</script>

<svelte:head>
	<title>{config.title}</title>
</svelte:head>
