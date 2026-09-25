<script lang="ts">
	import CellEditor from './CellEditor.svelte';
	import { type Braille } from '../braille';

	interface Props {
		selectedFrame: Braille[][];
		onToggleDot: (row: number, col: number, dotIdx: number) => void;
		disabled: boolean;
	}

	let { selectedFrame, onToggleDot, disabled }: Props = $props();
	let cols = $derived(selectedFrame[0].length);
</script>

<div class="grid gap-3" style="grid-template-columns: repeat({cols}, min-content);">
	{#each selectedFrame as row, r}
		{#each row as cell, c}
			<CellEditor {cell} onToggleDot={(dotIdx) => onToggleDot(r, c, dotIdx)} {disabled} />
		{/each}
	{/each}
</div>
