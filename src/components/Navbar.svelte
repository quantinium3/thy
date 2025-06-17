<script lang="ts">
	import { fly } from 'svelte/transition';
	import { Moon, Sun} from '@lucide/svelte';
	import { theme } from '$lib/theme.svelte';

	let links = [
		// {
		// 	name: 'home',
		// 	href: '/'
		// },
		// {
		// 	name: 'blog',
		// 	href: '/blog'
		// },
		{
			name: 'projects',
			href: '/project'
		},
		// {
		// 	name: 'guides',
		// 	href: '/guide'
		// },
		// {
		// 	name: 'resources',
		// 	href: '/resource'
		// },
		// {
		// 	name: 'frens',
		// 	href: '/fren'
		// }
	];
</script>

<div class="flex justify-between items-center py-5">
	<div
		class="flex space-x-1 items-center dark:text-orange-300 text-orange-400 font-bold">
		<span class="flex items-center text-md dark:text-orange-300 text-orange-400 font-bold">
		<a href="/" class="flex whitespace-nowrap text-lg">&gt; quantinium</a><span
			class="cursor-pulse ml-1 text-lg">|
		</span>
		</span>
	</div>

	<div class="flex gap-2">
		<div class="flex flex-wrap items-center gap-2">
		{#each links as link (link.name)}
			<a href={link.href}
				 class="link-animate text-black dark:text-white dark:hover:border-b-white">{link.name}</a>
			{/each}
			<button class="border px-1 rounded-sm hover:bg-amber-100"
							onclick={window.location.href="/login"}>login
			</button>
		</div>
		<div class="flex items-center gap-3">
				<button onclick={theme.toggle} aria-label="Toggle theme">
					{#if theme.current === 'dark'}
						<div in:fly={{ y: 10 }}>
							<Sun size={15}/>
						</div>
					{:else}
						<div in:fly={{ y: -10 }}>
							<Moon size={15}/>
						</div>
					{/if}
				</button>
		</div>
	</div>
</div>

<style>
    .link-animate	{
      position: relative;
      text-decoration: none;
      transition: color .6s ease-out;
	}

	.link-animate:hover {
      right: 0;
      text-decoration: none;
  }

	.link-animate:hover:after {
      right: 0;
	}

	.link-animate:after {
      border-radius: 1em;
      border-top: .1em solid;
      content: "";
      position: absolute;
      right: 100%;
      bottom: .14em;
      left: 0;
      transition: right .4s cubic-bezier(0,.5,0,1),
      border-color .4s ease-out;
  }

	.link-animate:hover:after {
			right: 0;
	}

	.cursor-pulse {
			animation: pulse 1s infinite;
	}
</style>
