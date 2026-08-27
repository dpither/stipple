<script lang="ts">
	import { type Braille, frameToString } from '../braille';
	import TooltipButton from './TooltipButton.svelte';

	interface Props {
		frame: Braille[][];
		label: number;
		isActive: boolean;
		canDelete: boolean;
		onSelectFrame: () => void;
		onDeleteFrame: () => void;
		onDuplicateFrame: () => void;
	}

	let { frame, label, isActive, canDelete, onSelectFrame, onDeleteFrame, onDuplicateFrame }: Props =
		$props();
	let rows = $derived(frame.length);
	let cols = $derived(frame[0].length);
</script>

<div
	class=" border-border hover:border-accent has-focus-visible:border-accent relative flex-none overflow-hidden border"
	role="listitem"
	class:border-muted={isActive}
>
	<span class="pointer-events-none absolute top-0 left-0 p-1 text-xs">{label}</span>
	<span class="text-muted pointer-events-none absolute bottom-0 left-0 p-1 text-xs"
		>{rows}x{cols}</span
	>
	<div class="bt absolute -top-px -right-px" class:hidden={!canDelete}>
		<TooltipButton onclick={onDeleteFrame} tooltip="Delete frame [Delete]">
			<span class="icon-[material-symbols--delete-sharp] size-4"></span>
		</TooltipButton>
	</div>
	<div class="absolute -right-px -bottom-px">
		<TooltipButton onclick={onDuplicateFrame} tooltip="Duplicate frame [Shift + D]">
			<span class="icon-[material-symbols--content-copy-sharp] size-4"></span>
		</TooltipButton>
	</div>
	<button
		class="flex size-24 cursor-pointer items-center justify-center outline-none"
		aria-label="select frame {label}"
		aria-pressed={isActive}
		onclick={onSelectFrame}
	>
		<span class="text-accent leading-4 whitespace-pre">{frameToString(frame)}</span>
	</button>
</div>
