<script lang="ts">
	import { DropdownMenu } from 'bits-ui';
	import { type Braille, framesToPlainText, framesToJSON, framesToCSS } from '../braille';
	import { showToast } from '../toast.svelte';

	interface Props {
		frames: Braille[][][];
		fps: number;
	}

	let { frames, fps }: Props = $props();

	const exportOptions = [
		{
			label: 'Plain Text',
			subtitle: 'Animation frames as text blocks',
			getValue: () => framesToPlainText(frames),
			copyText: 'plain text'
		},
		{
			label: 'JSON',
			subtitle: 'Animation frames as a data array',
			getValue: () => framesToJSON(frames),
			copyText: 'JSON'
		},
		{
			label: 'CSS',
			subtitle: 'Animation as a CSS class and keyframes',
			getValue: () => framesToCSS(frames, fps),
			copyText: 'CSS'
		},
		{
			label: 'Link',
			subtitle: 'Animation as a shareable link',
			getValue: () => window.location.href,
			copyText: 'a link'
		}
	];

	async function handleSelect(option: (typeof exportOptions)[number]) {
		await navigator.clipboard.writeText(option.getValue());
		showToast(
			`Copied ${frames.length} frame${frames.length > 1 ? 's' : ''} as ${option.copyText}.`
		);
	}
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger class="btn text-sm md:gap-2 md:px-2">
		<span class="icon-[material-symbols--content-copy-sharp] size-4"></span>
		<span class="hidden md:inline">Copy as…</span>
		<span class="icon-[mdi--chevron-down] size-4"></span>
	</DropdownMenu.Trigger>
	<DropdownMenu.Portal>
		<DropdownMenu.Content
			class="bg-panel border-border data-[state=open]:animate-scale-in data-[state=closed]:animate-scale-out flex flex-col border p-1 text-sm outline-none"
			sideOffset={4}
			align={'end'}
		>
			{#each exportOptions as option (option.label)}
				<DropdownMenu.Item
					class="transition-colors-default hocus:bg-border flex cursor-pointer flex-col px-2 py-1 outline-none"
					onSelect={() => handleSelect(option)}
					><span class="text-sm">{option.label}</span><span class="text-muted text-xs"
						>{option.subtitle}</span
					></DropdownMenu.Item
				>
			{/each}
		</DropdownMenu.Content>
	</DropdownMenu.Portal>
</DropdownMenu.Root>
