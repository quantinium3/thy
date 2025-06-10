<script lang="ts">
	import {Github, Twitter, Rss} from '@lucide/svelte';
</script>
<footer class="flex justify-between py-5">
	<div>quantinium @{new Date().getFullYear()}</div>
	<div class="flex gap-2">
		<a href="/rss-xml" target="_blank">
			<Rss />
		</a>
		<a href="https://github.com/quantinium3" target="_blank">
			<Github />
		</a>
		<a href="https://x.com/quantinium3" target="_blank">
			<Twitter />
		</a>
	</div>
</footer>