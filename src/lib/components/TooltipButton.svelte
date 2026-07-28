<script lang="ts">
	import { Tooltip } from 'bits-ui';
	import type { Snippet } from 'svelte';

	interface Props {
		tooltip: string;
		onclick?: () => void;
		disabled?: boolean;
		children: Snippet;
	}

	let { tooltip, onclick, disabled, children }: Props = $props();
</script>

<Tooltip.Root>
	<Tooltip.Trigger
		class=" transition-colors-default border-border hocus:text-accent hocus:bg-border hocus:border-accent disabled:text-border flex cursor-pointer items-center justify-center border p-1 outline-none disabled:pointer-events-none"
		aria-label={tooltip}
		{disabled}
		{onclick}
	>
		{@render children()}
	</Tooltip.Trigger>
	<Tooltip.Portal>
		<Tooltip.Content
			sideOffset={4}
			class="animate-scale-in data-[state=closed]:animate-scale-out bg-panel border-border border px-2 py-1 text-xs"
		>
			{tooltip}
		</Tooltip.Content>
	</Tooltip.Portal>
</Tooltip.Root>
