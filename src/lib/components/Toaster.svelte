<script lang="ts">
	import { fly } from 'svelte/transition';
	import { toast } from '../toast.svelte';
</script>

{#if toast.visible}
	{#key toast.id}
		<div
			class="right pointer-events-none absolute bottom-4"
			transition:fly|global={{ y: 4, duration: 150 }}
		>
			<div
				class="bg-panel text-success border-border flex h-8 items-center gap-2 border px-2 text-xs"
			>
				<span class="icon-[material-symbols--check] text-success size-4"></span>{toast.message}
			</div>
		</div>
	{/key}
{/if}
