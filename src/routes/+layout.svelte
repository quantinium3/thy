<script lang="ts">
	import '../app.css';
	import Navbar from '$components/Navbar.svelte';
	import PageTransition from './transition.svelte';

	let { children, data } = $props();

	const links = [
		{
			name: 'home',
			href: '/'
		},
		{
			name: 'about',
			href: '/about'
		},
		{
			name: 'project',
			href: '/project'
		},
		{
			name: 'blog',
			href: '/blog'
		},
		{
			name: 'github',
			href: 'https://github.com/quantinium3'
		},
		{
			name: 'last.fm',
			href: 'https://www.last.fm/user/Quantinium_X'
		},
		{
			name: 'contact',
			href: '/about#contact'
		},
		{
			name: 'logs',
			href: '/logs'
		},
		{
			name: 'spotify',
			href: 'https://open.spotify.com/user/alcivd1065ibqww5vo9hemnus?si=9626e0194c4e418f'
		},
		{
			name: 'rss',
			href: '/rss-xml'
		}
	];

	let sidebarOpen = $state(false);
	const toggleSidebar = () => {
		sidebarOpen = !sidebarOpen;
	};
</script>

<Navbar {toggleSidebar} />
<div
	class="sidebar fixed top-[3rem] z-10 min-h-screen min-w-[70%] bg-[#FCFAF6]/90 pt-3 backdrop-blur-xl duration-300 ease-out dark:bg-[#161411]/90 {sidebarOpen
		? 'open'
		: ''}"
>
	<div class="flex flex-col gap-3">
		{#each links as link (link.name)}
			<a href={link.href} class="hover:underline hover:underline-offset-2">{link.name}</a>
		{/each}
	</div>
</div>
<main class="mx-auto max-w-5xl">
	<PageTransition url={data.url}>
		{@render children()}
	</PageTransition>
</main>

<style>
	.sidebar.open {
		transform: translateX(0);
	}
	.sidebar {
		transform: translateX(-200%);
	}
</style>
