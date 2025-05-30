<script lang="ts">
    import Navbar from '../components/Navbar.svelte';
	import '../app.css';

	let { children } = $props();
</script>

<div class="border-b">
    <Navbar />
</div>
{@render children()}

