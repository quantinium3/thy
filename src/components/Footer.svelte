<script lang="ts">
	import {Github, Linkedin, Rss} from '@lucide/svelte';
</script>
<footer class="flex justify-betwee4">
	<div>quantinium @{new Date().getFullYear()}</div>
	<div class="flex gap-2">
		<Rss />
		<Github />
		<Linkedin />
	</div>
</footer>