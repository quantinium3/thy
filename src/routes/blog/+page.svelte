<script lang="ts">
	import * as config from '$lib/config';
	import Blog from '$components/Blog.svelte';
	import { fly } from 'svelte/transition';
	import { Moon, Sun } from '@lucide/svelte';
	import { theme } from '$lib/theme.svelte';

	let { data } = $props();

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
        }
	];
</script>

<svelte:head>
	<title>{config.title}</title>
</svelte:head>

<div class="my-5 flex flex-col justify-between py-3 dark:text-white">
		<pre class="text-[0.4rem] lg:text-xs leading-none text-center">
 ▄▄▄▄    ██▓     ▒█████    ▄████   ██████ 
▓█████▄ ▓██▒    ▒██▒  ██▒ ██▒ ▀█▒▒██    ▒ 
▒██▒ ▄██▒██░    ▒██░  ██▒▒██░▄▄▄░░ ▓██▄   
▒██░█▀  ▒██░    ▒██   ██░░▓█  ██▓  ▒   ██▒
░▓█  ▀█▓░██████▒░ ████▓▒░░▒▓███▀▒▒██████▒▒
░▒▓███▀▒░ ▒░▓  ░░ ▒░▒░▒░  ░▒   ▒ ▒ ▒▓▒ ▒ ░
▒░▒   ░ ░ ░ ▒  ░  ░ ▒ ▒░   ░   ░ ░ ░▒  ░ ░
 ░    ░   ░ ░   ░ ░ ░ ▒  ░ ░   ░ ░  ░  ░  
 ░          ░  ░    ░ ░        ░       ░  
    </pre>
	<div class="text-md lg:text-lg flex flex-wrap gap-3 justify-center">
		{#each links as link (link)}
			<span>[<a href={link.href} class="hover:underline hover:underline-offset-4">{link.name}</a>]</span>
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

<div class="flex flex-col lg:flex-row dark:text-white gap-8 mx-3">
  <section class="lg:w-3/4 w-full">
    <div class="flex flex-col gap-3">
      {#each data.blogs as blog (blog)}
        <Blog {blog} />
      {/each}
    </div>
  </section>

  <aside class="lg:w-1/4 w-full">
    <div class="border p-4 rounded-md shadow-sm">
      <h1 class="font-semibold text-2xl mb-3">Filter:</h1>
      {#each data.blogs as blog (blog)}
        <div class="flex flex-col gap-2 mb-2">
          {#each blog.categories as category (category)}
            <div class="flex items-center gap-2">
              <input type="checkbox" id="{category}" />
              <label for="{category}">{category}</label>
            </div>
          {/each}
        </div>
      {/each}
    </div>
  </aside>
</div>
