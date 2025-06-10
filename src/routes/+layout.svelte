<script lang="ts">
	import '../app.css';
	import Navbar from '$components/Navbar.svelte';
	import NavSidebar from '$components/NavSidebar.svelte';
	import Footer from '$components/Footer.svelte';

	let { children } = $props();

</script>

<Navbar />
{@render children()}