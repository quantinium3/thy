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

<div class="my-5 flex flex-col justify-between py-3 dark:text-white">
	<pre class="text-center text-[0.4rem] leading-none lg:text-xs">
 ██▀███  ▓█████   ██████  ▒█████   █    ██  ██▀███   ▄████▄  ▓█████   ██████ 
▓██ ▒ ██▒▓█   ▀ ▒██    ▒ ▒██▒  ██▒ ██  ▓██▒▓██ ▒ ██▒▒██▀ ▀█  ▓█   ▀ ▒██    ▒ 
▓██ ░▄█ ▒▒███   ░ ▓██▄   ▒██░  ██▒▓██  ▒██░▓██ ░▄█ ▒▒▓█    ▄ ▒███   ░ ▓██▄   
▒██▀▀█▄  ▒▓█  ▄   ▒   ██▒▒██   ██░▓▓█  ░██░▒██▀▀█▄  ▒▓▓▄ ▄██▒▒▓█  ▄   ▒   ██▒
░██▓ ▒██▒░▒████▒▒██████▒▒░ ████▓▒░▒▒█████▓ ░██▓ ▒██▒▒ ▓███▀ ░░▒████▒▒██████▒▒
░ ▒▓ ░▒▓░░░ ▒░ ░▒ ▒▓▒ ▒ ░░ ▒░▒░▒░ ░▒▓▒ ▒ ▒ ░ ▒▓ ░▒▓░░ ░▒ ▒  ░░░ ▒░ ░▒ ▒▓▒ ▒ ░
  ░▒ ░ ▒░ ░ ░  ░░ ░▒  ░ ░  ░ ▒ ▒░ ░░▒░ ░ ░   ░▒ ░ ▒░  ░  ▒    ░ ░  ░░ ░▒  ░ ░
  ░░   ░    ░   ░  ░  ░  ░ ░ ░ ▒   ░░░ ░ ░   ░░   ░ ░           ░   ░  ░  ░  
   ░        ░  ░      ░      ░ ░     ░        ░     ░ ░         ░  ░      ░  
    </pre>
	<div class="text-md flex flex-wrap justify-center gap-3 lg:text-lg">
		{#each links as link (link)}
			<span
				>[<a href={link.href} class="hover:underline hover:underline-offset-4">{link.name}</a
				>]</span
			>
		{/each}
		<button onclick={theme.toggle} aria-label="Toggle theme">
			{#if theme.current === 'dark'}
				<div in:fly={{ y: 10 }}>
					<Sun />
				</div>
			{:else}
				<div in:fly={{ y: -10 }}>
					<Moon />
				</div>
			{/if}
		</button>
	</div>
</div>
