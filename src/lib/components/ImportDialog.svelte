<script lang="ts">
	import { Dialog } from 'bits-ui';
	import { frameToString, parseInput, type Braille } from '../braille';
	import { showToast } from '../toast.svelte';

	interface Props {
		onImport: (frames: Braille[][][]) => void;
	}

	let { onImport }: Props = $props();
	let inputValue = $state('');
	let parsedFrames = $state<Braille[][][] | null>(null);
	let isOpen = $state(false);
	let error = $state<string | null>(null);

	function handleInput() {
		error = null;
		parsedFrames = null;
		if (!inputValue.trim()) return;
		try {
			parsedFrames = parseInput(inputValue.trim());
		} catch (e) {
			error = e instanceof Error ? e.message : 'Format not recognized.';
		}
	}

	function handleImport() {
		if (!parsedFrames) return;
		onImport(parsedFrames);
		showToast(`Imported ${parsedFrames.length} frame${parsedFrames.length > 1 ? 's' : ''}`);
		isOpen = false;
	}

	function reset() {
		inputValue = '';
		parsedFrames = null;
	}
</script>

<Dialog.Root bind:open={isOpen} onOpenChangeComplete={reset}>
	<Dialog.Trigger class="btn text-sm md:gap-2 md:px-2">
		<span class="icon-[material-symbols--upload-sharp] size-4"></span>
		<span class="hidden md:inline">Import</span>
	</Dialog.Trigger>
	<Dialog.Portal>
		<Dialog.Overlay
			class="data-[state=open]:animate-fade-in data-[state=closed]:animate-fade-out bg-bg/50 fixed inset-0"
		>
			<Dialog.Content
				class="data-[state=open]:animate-scale-in data-[state=closed]:animate-scale-out border-border bg-panel fixed top-1/2 left-1/2 flex w-full max-w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 flex-col border sm:max-w-sm"
			>
				<div class="border-border flex items-center justify-between border-b p-4">
					<Dialog.Title class="flex items-center gap-2">
						<span class="icon-[material-symbols--upload-sharp] size-4"></span>
						<span class="leading-4">Import Animation</span>
					</Dialog.Title>
				</div>
				<div class=" flex flex-col gap-4 p-4 text-sm">
					<Dialog.Description class="text-muted"
						>Import by pasting a previously copied animation (Plain Text or JSON).</Dialog.Description
					>
					<div class="flex flex-col gap-2">
						<textarea
							bind:value={inputValue}
							oninput={handleInput}
							class="transition-colors-default border-border focus-visible:border-accent resize-none border p-1 outline-none"
							placeholder="Paste Plain Text or JSON..."
							rows={6}
							aria-invalid="true"
							aria-errormessage="hi"
						></textarea>
					</div>
					<div class="flex flex-col gap-2">
						<span class="text-sm">Preview</span>
						<div class="border-border flex flex-col border">
							<div class="flex h-8 gap-2 px-4 pt-4 text-xs">
								{#if parsedFrames && !error}
									<span class="icon-[material-symbols--check] text-success size-4"></span><span
										class="text-success"
										>Detected {parsedFrames.length} frame{parsedFrames.length > 1 ? 's' : ''}.</span
									>
								{/if}
								{#if error}
									<span class="icon-[material-symbols--close-sharp] text-error size-4 flex-none"
									></span><span class="text-error">Error: {error}</span>
								{/if}
							</div>
							<div class="flex h-24 w-full items-center gap-2 overflow-y-auto px-4">
								{#if parsedFrames && !error}
									{#each parsedFrames as frame, idx (idx)}
										<div
											class="border-border relative flex size-16 flex-none items-center justify-center border"
										>
											<span class="pointer-events-none absolute top-0 left-0 p-0.5 text-xs"
												>{idx + 1}</span
											>
											<span class="text-accent leading-4 whitespace-pre"
												>{frameToString(frame)}</span
											>
										</div>
									{/each}
								{/if}
							</div>
						</div>
					</div>
				</div>

				<div class="border-border flex flex-col gap-2 border-t p-4">
					<div class="flex items-center justify-center gap-2 text-xs">
						<span class="icon-[material-symbols--warning-sharp] text-warn size-4"></span><span
							class="text-warn">Importing will replace the current animation.</span
						>
					</div>
					<div class="flex justify-end gap-2 text-sm">
						<Dialog.Close class="btn px-2">Cancel</Dialog.Close>
						<button class="btn px-2" onclick={handleImport} disabled={!parsedFrames || !!error}
							><span class="icon-[material-symbols--upload-sharp] size-4"></span>
							<span>Import</span></button
						>
					</div>
				</div>
				<Dialog.Close
					class="transition-colors-default hocus:text-accent hocus:bg-border absolute top-3 right-3 flex cursor-pointer p-1 outline-none"
				>
					<span class="icon-[material-symbols--close-sharp] size-4"></span>
					<span class="sr-only">Close</span>
				</Dialog.Close>
			</Dialog.Content>
		</Dialog.Overlay>
	</Dialog.Portal>
</Dialog.Root>
