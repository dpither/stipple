<script lang="ts">
	import { ScrollArea, Tooltip } from 'bits-ui';
	import Canvas from './lib/components/Canvas.svelte';
	import Frame from './lib/components/Frame.svelte';
	import TooltipButton from './lib/components/TooltipButton.svelte';
	import { onDestroy, onMount } from 'svelte';
	import { initKeyboardShortcuts } from './lib/keyboardShortcuts';
	import FPSControl from './lib/components/FPSControl.svelte';
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
	import {
		DEFAULT_FPS,
		MAX_FPS,
		MIN_FPS,
		onURLStateChange,
		readStateFromURL,
		syncStateToURL
	} from './lib/appState';
	import { SortableList, sortItems } from '@rodrigodagostino/svelte-sortable-list';

	type UIFrame = { frame: Braille[][]; id: string };

	let activeFrameIdx = $state(0);
	let uiFrames = $state<UIFrame[]>([
		{ frame: createEmptyFrame(MIN_ROWS, MIN_COLS), id: crypto.randomUUID() }
	]);
	let frames = $derived(uiFrames.map(({ frame, id }) => frame));
	let activeFrame = $derived(uiFrames[activeFrameIdx].frame);
	let rows = $derived(activeFrame.length);
	let cols = $derived(activeFrame[0].length);
	let isPlaying = $state(false);
	let fps = $state(DEFAULT_FPS);
	let playbackInterval = -1;
	let unsubscribeHashChange: (() => void) | undefined;

	function toggleDot(row: number, col: number, dotIdx: number) {
		activeFrame[row][col][dotIdx] = !activeFrame[row][col][dotIdx];
		syncStateToURL({ frames, fps });
	}

	function selectFrame(frameIdx: number) {
		activeFrameIdx = frameIdx;
	}

	function addFrame() {
		uiFrames.push({ frame: createEmptyFrame(rows, cols), id: crypto.randomUUID() });
		activeFrameIdx = frames.length - 1;
		syncStateToURL({ frames, fps });
	}

	function deleteFrame(frameIdx: number) {
		if (frames.length === 1) return;
		uiFrames.splice(frameIdx, 1);
		if (activeFrameIdx >= frameIdx) activeFrameIdx = Math.max(0, activeFrameIdx - 1);
		syncStateToURL({ frames, fps });
	}

	function duplicateFrame(frameIdx: number) {
		uiFrames.push({ frame: copyFrame(uiFrames[frameIdx].frame), id: crypto.randomUUID() });
		activeFrameIdx = frames.length - 1;
		syncStateToURL({ frames, fps });
	}

	function resizeActiveFrame(newRows: number, newCols: number) {
		const newFrame = createEmptyFrame(newRows, newCols);
		for (let r = 0; r < Math.min(newRows, activeFrame.length); r++) {
			for (let c = 0; c < Math.min(newCols, activeFrame[0].length); c++) {
				newFrame[r][c] = [...activeFrame[r][c]];
			}
		}
		uiFrames[activeFrameIdx].frame = newFrame;
		rows = newRows;
		cols = newCols;
		syncStateToURL({ frames, fps });
	}

	function tick() {
		activeFrameIdx = (activeFrameIdx + 1) % frames.length;
	}

	function updateFPS(newFPS: number) {
		fps = Math.max(Math.min(newFPS, MAX_FPS), MIN_FPS);
		if (isPlaying) {
			clearInterval(playbackInterval);
			playbackInterval = setInterval(tick, 1000 / fps);
		}
		syncStateToURL({ frames, fps });
	}

	function togglePlay() {
		if (isPlaying) {
			isPlaying = false;
			clearInterval(playbackInterval);
		} else {
			isPlaying = true;
			playbackInterval = setInterval(tick, 1000 / fps);
		}
	}

	function prevFrame() {
		activeFrameIdx = (activeFrameIdx - 1 + uiFrames.length) % uiFrames.length;
	}

	function nextFrame() {
		activeFrameIdx = (activeFrameIdx + 1) % uiFrames.length;
	}

	function importFrames(newFrames: Braille[][][]) {
		activeFrameIdx = 0;
		uiFrames = newFrames.map((frame) => ({ frame, id: crypto.randomUUID() }));
		syncStateToURL({ frames, fps });
	}

	onMount(() => {
		initKeyboardShortcuts(
			togglePlay,
			() => isPlaying,
			nextFrame,
			prevFrame,
			addFrame,
			() => duplicateFrame(activeFrameIdx),
			() => deleteFrame(activeFrameIdx)
		);
		const readState = readStateFromURL();
		if (readState) {
			uiFrames = readState.frames.map((frame) => ({ frame, id: crypto.randomUUID() }));
			fps = readState.fps;
		}

		unsubscribeHashChange = onURLStateChange((state) => {
			if (state) {
				uiFrames = state.frames.map((frame) => ({ frame, id: crypto.randomUUID() }));
				fps = state.fps;
			}
		});
	});

	onDestroy(() => {
		unsubscribeHashChange?.();
	});

	function handleDragStart(e: SortableList.RootEvents['ondragstart']) {
		const { draggedItemIndex } = e;
		activeFrameIdx = draggedItemIndex;
	}

	function handleDragEnd(e: SortableList.RootEvents['ondragend']) {
		const { draggedItemIndex, targetItemIndex, isCanceled } = e;
		if (
			!isCanceled &&
			typeof targetItemIndex === 'number' &&
			draggedItemIndex !== targetItemIndex
		) {
			activeFrameIdx = targetItemIndex;
			uiFrames = sortItems(uiFrames, draggedItemIndex, targetItemIndex);
			syncStateToURL({ frames, fps });
		}
	}
</script>

<Tooltip.Provider delayDuration={400} skipDelayDuration={200}>
	<div class="flex h-screen flex-col">
		<!-- HEADER -->
		<header class="flex items-center px-4 py-2">
			<div class="flex items-baseline justify-start gap-4">
				<Logo />
				<div class="text-muted text-xs">
					<a
						href="https://github.com/dpither/stipple"
						target="_blank"
						rel="noopener noreferrer external"
						aria-label="source code (opens in new tab)"
						class="link flex items-center gap-1"
					>
						v1.0
					</a>
				</div>
			</div>
			<div class="flex flex-1 justify-end gap-2">
				<ImportDialog onImport={importFrames} /><CopyDropdownMenu {frames} />
			</div>
		</header>
		<main class="relative flex h-full flex-col justify-between">
			<div class="relative flex flex-1 items-center justify-center">
				<Canvas {activeFrame} onToggleDot={toggleDot} disabled={isPlaying} />
				<Toaster />
			</div>
			<!-- BOTTOM PANEL -->
			<div class="bg-panel border-border flex flex-col border-t">
				<div class="border-border flex items-center gap-2 border-b px-4 py-2">
					<div class="flex flex-1 justify-start">
						<FPSControl {fps} min={MIN_FPS} max={MAX_FPS} onValueCommit={updateFPS} />
					</div>
					<div class="flex justify-center">
						<!-- TIME CONTROL -->
						<div class="flex gap-1">
							<TooltipButton
								class="btn"
								onclick={prevFrame}
								tooltip="Previous Frame [,]"
								disabled={isPlaying}
							>
								<span class="icon-[mdi--skip-previous] size-4"></span>
							</TooltipButton>
							<TooltipButton
								class="btn"
								onclick={togglePlay}
								tooltip={isPlaying ? 'Pause [Space]' : 'Play [Space]'}
							>
								<span
									class="size-4"
									class:icon-[mdi--pause]={isPlaying}
									class:icon-[mdi--play]={!isPlaying}
								></span>
							</TooltipButton>
							<TooltipButton
								class="btn"
								onclick={nextFrame}
								tooltip="Next Frame [.]"
								disabled={isPlaying}
							>
								<span class="icon-[mdi--skip-next] size-4"></span>
							</TooltipButton>
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
								onChange={(newRows) => resizeActiveFrame(newRows, cols)}
							/>
							<FrameSizeControl
								label="Cols"
								bind:value={cols}
								min={MIN_COLS}
								max={MAX_COLS}
								disabled={isPlaying}
								onChange={(newCols) => resizeActiveFrame(rows, newCols)}
							/>
						</div>
					</div>
				</div>
				<!-- FRAME LIST -->
				<ScrollArea.Root type="auto" class="relative w-screen overflow-hidden">
					<ScrollArea.Viewport class="focus-visible:border-b-accent border-border  w-full border-b">
						<div class="flex gap-2 px-4 py-4">
							<SortableList.Root
								class="focus-visible:outline-accent focus-visible:outline-1 focus-visible:outline-offset-1"
								gap={8}
								direction="horizontal"
								ondragstart={handleDragStart}
								ondragend={handleDragEnd}
								hasLockedAxis={true}
								aria-label="Frame list"
							>
								{#each uiFrames as uiFrame, index (uiFrame.id)}
									<SortableList.Item
										class="group focus-visible:outline-muted focus-visible:outline-1 focus-visible:outline-offset-2"
										id={uiFrame.id}
										{index}
									>
										<Frame
											{index}
											frame={uiFrame.frame}
											isActive={index === activeFrameIdx}
											canDelete={frames.length !== 1}
											onSelectFrame={() => selectFrame(index)}
											onDeleteFrame={() => deleteFrame(index)}
											onDuplicateFrame={() => duplicateFrame(index)}
										/>
									</SortableList.Item>
								{/each}
							</SortableList.Root>
							<TooltipButton class="btn" onclick={addFrame} tooltip="Add new frame [Shift + N]"
								><div class="flex h-full items-center justify-center">
									<span class="icon-[mdi--add] size-4"></span>
								</div></TooltipButton
							>
						</div>
					</ScrollArea.Viewport>
					<ScrollArea.Scrollbar
						orientation="horizontal"
						class="border-border bg-panel flex h-2 border-t"
					>
						<ScrollArea.Thumb class="transition-colors-default bg-border hover:bg-accent" />
					</ScrollArea.Scrollbar>
				</ScrollArea.Root>
			</div>
		</main>
	</div>
</Tooltip.Provider>
