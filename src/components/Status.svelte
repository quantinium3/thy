<script lang="ts">
	import { useLanyard } from 'svelte-lanyard';

	const data = useLanyard('182292736790102017');
</script>
{#if $data}
	<p>My Discord username is {$data.discord_user.username}#{$data.discord_user.discriminator}</p>
{:else}
	<p>Waiting to fetch Discord data...</p>
{/if}