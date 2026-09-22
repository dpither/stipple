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
	<Tooltip.Trigger class="btn" aria-label={tooltip} {disabled} {onclick}>
		{@render children()}
	</Tooltip.Trigger>
	<Tooltip.Portal>
		<Tooltip.Content
			sideOffset={4}
			class="animate-scale-in data-[state=closed]:animate-scale-out bg-panel border-border shrink-0 border px-2 py-1 text-xs"
		>
			{tooltip}
		</Tooltip.Content>
	</Tooltip.Portal>
</Tooltip.Root>
