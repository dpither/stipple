<script lang="ts">
	import { GRID_TO_DOT, type Braille } from '../braille';

	interface Props {
		cell: Braille;
		onToggleDot: (dotIdx: number) => void;
		disabled: boolean;
	}

	let { cell, onToggleDot, disabled }: Props = $props();
</script>

<div class="grid grid-cols-[repeat(2,24px)] gap-3" aria-label="dot editor" role="group">
	{#each GRID_TO_DOT as dotIdx}
		<button
			class="hocus:outline-accent hocus:outline-1 flex size-6 cursor-pointer items-center justify-center rounded-4xl outline-0 disabled:pointer-events-none"
			class:bg-accent={cell[dotIdx]}
			class:bg-panel={!cell[dotIdx]}
			class:bg-transparent={!cell[dotIdx] && disabled}
			aria-label="dot {dotIdx}"
			aria-pressed={cell[dotIdx]}
			onclick={() => onToggleDot(dotIdx)}
			{disabled}
		></button>
	{/each}
</div>
