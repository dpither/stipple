<script lang="ts">
	import { fly } from 'svelte/transition';
	import { toast } from '../toast.svelte';
</script>

{#if toast.visible}
	{#key toast.id}
		<div
			class="bg-panel text-success border-border pointer-events-none absolute bottom-4 z-1 flex h-8 items-center gap-2 border px-2 text-xs select-none"
			transition:fly|global={{ y: 4, duration: 150 }}
		>
			<span class="icon-[material-symbols--check] text-success size-4"></span>{toast.message}
		</div>
	{/key}
{/if}
