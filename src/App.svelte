<script lang="ts">
	import Footer from './lib/components/Footer.svelte';
	import { Tooltip } from 'bits-ui';
	import Canvas from './lib/components/Canvas.svelte';
	import Frame from './lib/components/Frame.svelte';
	import TooltipButton from './lib/components/TooltipButton.svelte';
	import { onMount } from 'svelte';
	import { initKeyboardShortcuts } from './lib/keyboardShortcuts.svelete';
	import FrameRateControl from './lib/components/FrameRateControl.svelte';
	import FrameSizeControl from './lib/components/FrameSizeControl.svelte';
	import CopyDropdownMenu from './lib/components/CopyDropdownMenu.svelte';
	import ImportDialog from './lib/components/ImportDialog.svelte';
	import {
		MIN_ROWS,
		MAX_ROWS,
		MIN_COLS,
		MAX_COLS,
		createEmptyFrame,
		copyFrame,
		type Braille
	} from './lib/braille';
	import Logo from './lib/components/Logo.svelte';
	import Toaster from './lib/components/Toaster.svelte';

	const MIN_FRAME_RATE = 1;
	const MAX_FRAME_RATE = 60;
	const DEFAULT_FRAME_RATE = 12;

	let activeFrameIdx = $state(0);
	let frames = $state([createEmptyFrame(MIN_ROWS, MIN_COLS)]);
	let activeFrame = $derived(frames[activeFrameIdx]);
	let rows = $derived(activeFrame.length);
	let cols = $derived(activeFrame[0].length);
	let isPlaying = $state(false);
	let frameRate = $state(DEFAULT_FRAME_RATE);
	let interval = $state(-1);

	function toggleDot(row: number, col: number, dotIdx: number) {
		activeFrame[row][col][dotIdx] = !activeFrame[row][col][dotIdx];
	}

	function selectFrame(frameIdx: number) {
		activeFrameIdx = frameIdx;
	}

	function addFrame() {
		frames.push(createEmptyFrame(rows, cols));
		activeFrameIdx = frames.length - 1;
	}

	function deleteFrame(frameIdx: number) {
		if (frames.length === 1) return;
		frames.splice(frameIdx, 1);
		if (activeFrameIdx >= frameIdx) activeFrameIdx = Math.max(0, activeFrameIdx - 1);
	}

	function duplicateFrame(frameIdx: number) {
		frames.push(copyFrame(frames[frameIdx]));
		activeFrameIdx = frames.length - 1;
	}

	function resizeActiveFrame(newRows: number, newCols: number) {
		newRows = Math.max(Math.min(newRows, MAX_ROWS), MIN_ROWS);
		newCols = Math.max(Math.min(newCols, MAX_COLS), MIN_COLS);
		const newFrame = createEmptyFrame(newRows, newCols);
		for (let r = 0; r < Math.min(newRows, activeFrame.length); r++) {
			for (let c = 0; c < Math.min(newCols, activeFrame[0].length); c++) {
				newFrame[r][c] = [...activeFrame[r][c]];
			}
		}
		frames[activeFrameIdx] = newFrame;
		rows = newRows;
		cols = newCols;
	}

	function tick() {
		activeFrameIdx = (activeFrameIdx + 1) % frames.length;
	}

	function updateFrameRate(newFrameRate: number) {
		frameRate = newFrameRate;
		if (isPlaying) {
			clearInterval(interval);
			interval = setInterval(tick, 1000 / frameRate);
		}
	}

	function togglePlay() {
		if (isPlaying) {
			isPlaying = false;
			clearInterval(interval);
		} else {
			isPlaying = true;
			interval = setInterval(tick, 1000 / frameRate);
		}
	}

	function prevFrame() {
		activeFrameIdx = (activeFrameIdx - 1 + frames.length) % frames.length;
	}

	function nextFrame() {
		activeFrameIdx = (activeFrameIdx + 1) % frames.length;
	}

	function importFrames(newFrames: Braille[][][]) {
		activeFrameIdx = 0;
		frames = newFrames;
	}

	onMount(() =>
		initKeyboardShortcuts(
			togglePlay,
			() => isPlaying,
			nextFrame,
			prevFrame,
			addFrame,
			() => duplicateFrame(activeFrameIdx),
			() => deleteFrame(activeFrameIdx)
		)
	);
</script>

<svelte:head></svelte:head>

<Tooltip.Provider delayDuration={400} skipDelayDuration={200}>
	<div class="flex h-screen flex-col">
		<!-- HEADER -->
		<header class="bg-panel border-border flex border-b px-4 py-2">
			<div class="flex justify-start"><Logo /></div>
			<div class="flex flex-1 justify-end gap-2">
				<ImportDialog onImport={importFrames} /><CopyDropdownMenu {frames} />
			</div>
		</header>
		<div class="relative flex h-full flex-col justify-between">
			<div class="relative flex flex-1 items-center justify-center">
				<Canvas {activeFrame} onToggleDot={toggleDot} disabled={isPlaying} />
				<Toaster />
			</div>
			<!-- BOTTOM PANEL -->
			<div class="bg-panel border-border flex flex-col border-t">
				<div class="border-border flex items-center gap-2 border-b px-4 py-2">
					<div class="flex flex-1 justify-start">
						<FrameRateControl
							{frameRate}
							min={MIN_FRAME_RATE}
							max={MAX_FRAME_RATE}
							onValueCommit={updateFrameRate}
						/>
					</div>
					<div class="flex justify-center">
						<!-- TIME CONTROL -->
						<div class="flex gap-1">
							<TooltipButton onclick={prevFrame} tooltip="Previous Frame [,]" disabled={isPlaying}
								><span class="icon-[mdi--skip-previous] size-4"></span></TooltipButton
							>
							<TooltipButton
								onclick={togglePlay}
								tooltip={isPlaying ? 'Pause [Space]' : 'Play [Space]'}
								><span
									class="size-4"
									class:icon-[mdi--pause]={isPlaying}
									class:icon-[mdi--play]={!isPlaying}
								></span></TooltipButton
							>
							<TooltipButton onclick={nextFrame} tooltip="Next Frame [.]" disabled={isPlaying}
								><span class="icon-[mdi--skip-next] size-4"></span></TooltipButton
							>
						</div>
					</div>
					<div class="flex flex-1 justify-end">
						<div class="flex gap-2">
							<FrameSizeControl
								label="Rows"
								bind:value={rows}
								min={MIN_ROWS}
								max={MAX_ROWS}
								disabled={isPlaying}
								onIncrement={() => resizeActiveFrame(rows + 1, cols)}
								onDecrement={() => resizeActiveFrame(rows - 1, cols)}
								onChange={(newRows) => resizeActiveFrame(newRows, cols)}
							/>
							<FrameSizeControl
								label="Cols"
								bind:value={cols}
								min={MIN_COLS}
								max={MAX_COLS}
								disabled={isPlaying}
								onIncrement={() => resizeActiveFrame(rows, cols + 1)}
								onDecrement={() => resizeActiveFrame(rows, cols - 1)}
								onChange={(newCols) => resizeActiveFrame(rows, newCols)}
							/>
						</div>
					</div>
				</div>
				<!-- FRAME LIST -->
				<div class="flex gap-2 overflow-x-auto px-4 py-4">
					{#each frames as frame, idx (idx)}
						<Frame
							{frame}
							label={idx + 1}
							isActive={idx === activeFrameIdx}
							canDelete={frames.length !== 1}
							onSelectFrame={() => selectFrame(idx)}
							onDeleteFrame={() => deleteFrame(idx)}
							onDuplicateFrame={() => duplicateFrame(idx)}
						/>
					{/each}
					<TooltipButton onclick={addFrame} tooltip="Add new frame [Shift + N]"
						><div class="flex h-20 items-center justify-center">
							<span class="icon-[mdi--add] size-4"></span>
						</div></TooltipButton
					>
				</div>
			</div>
		</div>
		<Footer />
	</div>
</Tooltip.Provider>
