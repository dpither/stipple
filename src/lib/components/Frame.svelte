<script lang="ts">
	import { SortableList } from '@rodrigodagostino/svelte-sortable-list';
	import { type Braille, frameToString } from '../braille';
	import TooltipButton from './TooltipButton.svelte';

	interface Props {
		index: number;
		frame: Braille[][];
		isSelected: boolean;
		canDelete: boolean;
		onSelectFrame: () => void;
		onDeleteFrame: () => void;
		onDuplicateFrame: () => void;
	}

	let {
		index,
		frame,
		isSelected,
		canDelete,
		onSelectFrame,
		onDeleteFrame,
		onDuplicateFrame
	}: Props = $props();
	let rows = $derived(frame.length);
	let cols = $derived(frame[0].length);
</script>

<div
	class="border-border hover:border-accent has-focus-visible:border-accent bg-panel group-[[data-is-ghost='true'][data-drag-state*='ptr']]:border-accent relative flex-none shrink-0 overflow-hidden border group-[[data-is-ghost='false'][data-drag-state*='ptr']]:opacity-0"
	class:border-muted={isSelected}
>
	<span class="pointer-events-none absolute top-0 left-0 p-1 text-xs">{index + 1}</span>
	<span
		class="text-muted pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 p-1 text-center text-xs"
		>{rows}x{cols}</span
	>
	<div class="absolute -top-px -right-px" class:hidden={!canDelete}>
		<TooltipButton class="btn-ghost" onclick={onDeleteFrame} tooltip="Delete frame [Delete]">
			<span class="icon-[material-symbols--delete-sharp] size-4"></span>
		</TooltipButton>
	</div>
	<div class="absolute -right-px -bottom-px">
		<TooltipButton
			class="btn-ghost"
			onclick={onDuplicateFrame}
			tooltip="Duplicate frame [Shift + D]"
		>
			<span class="icon-[material-symbols--content-copy-sharp] size-4"></span>
		</TooltipButton>
	</div>
	<div class="absolute -bottom-px -left-px">
		<SortableList.ItemHandle
			class="group-[[data-is-ghost='true'][data-drag-state*='ptr-drag']]:bg-border group-[[data-is-ghost='true'][data-drag-state*='ptr-drag']]:text-accent hover:text-accent hover:bg-border flex p-1"
		>
			<span class="icon-[material-symbols--drag-indicator] size-4"></span>
		</SortableList.ItemHandle>
	</div>
	<button
		class="flex size-24 cursor-pointer items-center justify-center outline-none"
		aria-label="select frame {index + 1}"
		aria-pressed={isSelected}
		onclick={onSelectFrame}
	>
		<span class="text-accent leading-4 whitespace-pre">{frameToString(frame)}</span>
	</button>
</div>
