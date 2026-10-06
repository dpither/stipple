<script lang="ts">
	import { ScrollArea, Tooltip } from 'bits-ui';
	import Canvas from './lib/components/Canvas.svelte';
	import Frame from './lib/components/Frame.svelte';
	import TooltipButton from './lib/components/TooltipButton.svelte';
	import { onMount, tick } from 'svelte';
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
		type Braille,
		MAX_FRAMES,
		frameToString
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

	let uiFrames = $state<UIFrame[]>([
		{ frame: createEmptyFrame(MIN_ROWS, MIN_COLS), id: crypto.randomUUID() }
	]);
	// svelte-ignore state_referenced_locally
	let selectedId = $state(uiFrames[0].id);
	let selectedFrame = $derived(uiFrames.find((uiFrame) => uiFrame.id === selectedId)!.frame);
	let frames = $derived(uiFrames.map(({ frame }) => frame));
	let rows = $derived(selectedFrame.length);
	let cols = $derived(selectedFrame[0].length);
	let isPlaying = $state(false);
	let fps = $state(DEFAULT_FPS);
	let playbackInterval = -1;

	function toggleDot(row: number, col: number, dotIdx: number) {
		selectedFrame[row][col][dotIdx] = !selectedFrame[row][col][dotIdx];
		syncStateToURL({ frames, fps });
	}

	function selectFrame(frameId: string) {
		selectedId = frameId;
		scrollToFrame(frameId);
	}

	function addFrame() {
		if (frames.length >= MAX_FRAMES) return;
		const newId = crypto.randomUUID();
		uiFrames.push({ frame: createEmptyFrame(rows, cols), id: newId });
		selectFrame(newId);
		syncStateToURL({ frames, fps });
	}

	function deleteFrame(targetId: string) {
		if (uiFrames.length === 1) return;
		const targetIndex = uiFrames.findIndex((uiFrame) => uiFrame.id === targetId);
		uiFrames = uiFrames.filter((uiFrames) => uiFrames.id != targetId);
		if (targetId == selectedId) {
			selectedId = uiFrames[targetIndex]?.id ?? uiFrames[uiFrames.length - 1].id;
		}
		syncStateToURL({ frames, fps });
	}

	function duplicateFrame(targetId: string) {
		if (frames.length >= MAX_FRAMES) return;
		const frameIndex = uiFrames.findIndex((uiFrame) => uiFrame.id === targetId);
		const newId = crypto.randomUUID();
		uiFrames.splice(frameIndex + 1, 0, {
			frame: copyFrame(uiFrames[frameIndex].frame),
			id: newId
		});
		selectFrame(newId);
		syncStateToURL({ frames, fps });
	}

	function resizeSelectedFrame(newRows: number, newCols: number) {
		const target = uiFrames.find((uiFrame) => uiFrame.id === selectedId)!;
		const newFrame = createEmptyFrame(newRows, newCols);
		for (let r = 0; r < Math.min(newRows, selectedFrame.length); r++) {
			for (let c = 0; c < Math.min(newCols, selectedFrame[0].length); c++) {
				newFrame[r][c] = [...selectedFrame[r][c]];
			}
		}
		target.frame = newFrame;
		rows = newRows;
		cols = newCols;
		syncStateToURL({ frames, fps });
	}

	function tickAnimation() {
		const currentIndex = uiFrames.findIndex((uiFrame) => uiFrame.id === selectedId);
		const nextIndex = (currentIndex + 1) % uiFrames.length;
		selectedId = uiFrames[nextIndex].id;
	}

	function updateFPS(newFPS: number) {
		fps = Math.max(Math.min(newFPS, MAX_FPS), MIN_FPS);
		if (isPlaying) {
			clearInterval(playbackInterval);
			playbackInterval = setInterval(tickAnimation, 1000 / fps);
		}
		syncStateToURL({ frames, fps });
	}

	function togglePlay() {
		if (isPlaying) {
			isPlaying = false;
			scrollToFrame(selectedId);
			clearInterval(playbackInterval);
		} else {
			isPlaying = true;
			playbackInterval = setInterval(tickAnimation, 1000 / fps);
		}
	}

	function prevFrame() {
		const currentIndex = uiFrames.findIndex((uiFrame) => uiFrame.id === selectedId);
		const nextIndex = (currentIndex - 1 + uiFrames.length) % uiFrames.length;
		selectFrame(uiFrames[nextIndex].id);
	}

	function nextFrame() {
		const currentIndex = uiFrames.findIndex((uiFrame) => uiFrame.id === selectedId);
		const nextIndex = (currentIndex + 1) % uiFrames.length;
		selectFrame(uiFrames[nextIndex].id);
	}

	function importFrames(newFrames: Braille[][][]) {
		uiFrames = newFrames.map((frame) => ({ frame, id: crypto.randomUUID() }));
		selectedId = uiFrames[0].id;
		syncStateToURL({ frames, fps });
	}

	async function scrollToFrame(id: string) {
		await tick();
		await new Promise((r) => setTimeout(r, 150));
		document.getElementById(id)?.scrollIntoView({
			behavior: 'smooth',
			inline: 'nearest',
			block: 'nearest'
		});
	}

	onMount(() => {
		const cleanupShortcuts = initKeyboardShortcuts(
			togglePlay,
			() => isPlaying,
			nextFrame,
			prevFrame,
			addFrame,
			() => duplicateFrame(selectedId),
			() => deleteFrame(selectedId)
		);
		const readState = readStateFromURL();

		if (readState) {
			uiFrames = readState.frames.map((frame) => ({ frame, id: crypto.randomUUID() }));
			selectedId = uiFrames[0].id;
			fps = readState.fps;
		} else {
			syncStateToURL({ frames, fps });
		}

		const unsubscribeHashChange = onURLStateChange((state) => {
			if (state) {
				uiFrames = state.frames.map((frame) => ({ frame, id: crypto.randomUUID() }));
				fps = state.fps;
			}
		});

		return () => {
			unsubscribeHashChange();
			cleanupShortcuts();
		};
	});

	function handleDragStart(e: SortableList.RootEvents['ondragstart']) {
		const { draggedItemIndex } = e;
		selectedId = uiFrames[draggedItemIndex].id;
	}

	function handleDragEnd(e: SortableList.RootEvents['ondragend']) {
		const { draggedItemIndex, targetItemIndex, isCanceled } = e;
		if (
			!isCanceled &&
			typeof targetItemIndex === 'number' &&
			draggedItemIndex !== targetItemIndex
		) {
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
				<ImportDialog onImport={importFrames} /><CopyDropdownMenu {frames} {fps} />
			</div>
		</header>
		<main class="relative flex h-full flex-col justify-between">
			<div class="relative flex min-h-101 flex-1 items-center justify-center">
				<Canvas {selectedFrame} onToggleDot={toggleDot} disabled={isPlaying} />
				<Toaster />
				<span
					class="text-accent absolute bottom-4 left-1/2 -translate-x-1/2 leading-4 whitespace-pre"
					>{frameToString(selectedFrame)}</span
				>
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
								onChange={(newRows) => resizeSelectedFrame(newRows, cols)}
							/>
							<FrameSizeControl
								label="Cols"
								bind:value={cols}
								min={MIN_COLS}
								max={MAX_COLS}
								disabled={isPlaying}
								onChange={(newCols) => resizeSelectedFrame(rows, newCols)}
							/>
						</div>
					</div>
				</div>
				<!-- FRAME LIST -->
				<ScrollArea.Root type="auto" class="relative w-full overflow-clip">
					<ScrollArea.Viewport
						class="focus-visible:border-t-accent border-border scroll-px-13 border-b focus-visible:border-t"
					>
						<div class="flex w-max gap-2 px-4 py-4">
							<SortableList.Root
								class="focus-visible:outline-accent focus-visible:outline-1 focus-visible:outline-offset-1"
								gap={8}
								direction="horizontal"
								ondragstart={handleDragStart}
								ondragend={handleDragEnd}
								hasLockedAxis={true}
								hasBoundaries={true}
								transition={{
									duration: 150,
									easing: 'cubic-bezier(0.6, 0, 0.4, 1)'
								}}
								aria-label="Frame list"
							>
								{#each uiFrames as uiFrame, index (uiFrame.id)}
									<SortableList.Item
										class="group focus-visible:outline-accent focus-visible:outline-1 focus-visible:outline-offset-2"
										id={uiFrame.id}
										{index}
									>
										<Frame
											{index}
											frame={uiFrame.frame}
											isSelected={uiFrame.id === selectedId}
											canDelete={frames.length !== 1}
											canDuplicate={frames.length < MAX_FRAMES}
											onSelectFrame={() => selectFrame(uiFrame.id)}
											onDeleteFrame={() => deleteFrame(uiFrame.id)}
											onDuplicateFrame={() => duplicateFrame(uiFrame.id)}
										/>
									</SortableList.Item>
								{/each}
							</SortableList.Root>
							{#if frames.length < MAX_FRAMES}
								<TooltipButton class="btn" onclick={addFrame} tooltip="Add new frame [Shift + N]"
									><div class="flex h-full items-center justify-center">
										<span class="icon-[mdi--add] size-4"></span>
									</div></TooltipButton
								>
							{/if}
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
