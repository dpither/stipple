<script lang="ts">
	import { Label, Slider } from 'bits-ui';

	interface Props {
		frameRate: number;
		min: number;
		max: number;
		onValueCommit: (value: number) => void;
	}

	let { frameRate, min, max, onValueCommit }: Props = $props();
</script>

<div class="flex flex-col gap-2 text-xs md:flex-row md:items-center md:gap-1">
	<Label.Root id="framerate-label" for="framerate" class="w-[6ch] text-right select-none">
		{frameRate} FPS
	</Label.Root>
	<Slider.Root
		type="single"
		bind:value={frameRate}
		{onValueCommit}
		id="framerate"
		aria-labelledby="framerate-label"
		{min}
		{max}
		class="relative flex w-20 touch-none items-center select-none"
	>
		<span class="border-border bg-panel relative h-2 w-full cursor-pointer overflow-hidden border"
			><Slider.Range class="bg-fg absolute h-full"></Slider.Range></span
		>
		<Slider.Thumb
			index={0}
			class="transition-colors-default border-border bg-fg hocus:border-accent data-active:border-accent block size-4 cursor-pointer border outline-none"
		/>
	</Slider.Root>
</div>
