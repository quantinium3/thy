<script lang="ts">
	let {totalTime} = $props();
</script>

<div class="text-lg font-bold mb-2">Stats (weekly)</div>
<div class="hour"> > total - {totalTime} hr</div>
<div class="daily_avg"> > daily avg - {(totalTime / 7).toFixed(2)} hr</div>
<div class="hour"> > editor - neovim</div>
<div class="daily_avg"> > os - nixos</div>
<div class="daily_avg"> > current - aether</div>


