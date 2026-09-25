<script lang="ts">
	import { Label, Slider } from 'bits-ui';

	interface Props {
		fps: number;
		min: number;
		max: number;
		onValueCommit: (value: number) => void;
	}

	let { fps, min, max, onValueCommit }: Props = $props();
</script>

<div class="flex flex-col gap-2 text-xs md:flex-row md:items-center md:gap-1">
	<Label.Root id="fps-label" for="fps" class="w-[6ch] text-right">
		{fps} FPS
	</Label.Root>
	<Slider.Root
		type="single"
		bind:value={fps}
		{onValueCommit}
		id="fps"
		aria-labelledby="fps-label"
		{min}
		{max}
		class="relative flex w-20 touch-none items-center"
	>
		<span class="border-border bg-panel relative h-2 w-full cursor-pointer overflow-hidden border"
			><Slider.Range class="bg-fg absolute h-full"></Slider.Range></span
		>
		<Slider.Thumb
			aria-labelledby="fps-label"
			index={0}
			class="transition-colors-default border-border bg-fg hocus:border-accent data-active:border-accent block size-4 cursor-pointer border outline-none"
		/>
	</Slider.Root>
</div>
