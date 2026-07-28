<script lang="ts">
	import CellEditor from './CellEditor.svelte';
	import { type Braille } from '../braille';

	interface Props {
		activeFrame: Braille[][];
		onToggleDot: (row: number, col: number, dotIdx: number) => void;
		disabled: boolean;
	}

	let { activeFrame, onToggleDot, disabled }: Props = $props();
	let cols = $derived(activeFrame[0].length);
</script>

<div class="grid gap-3" style="grid-template-columns: repeat({cols}, min-content);">
	{#each activeFrame as row, r}
		{#each row as cell, c}
			<CellEditor {cell} onToggleDot={(dotIdx) => onToggleDot(r, c, dotIdx)} {disabled} />
		{/each}
	{/each}
</div>
