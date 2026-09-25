<script lang="ts">
	import { Tooltip } from 'bits-ui';
	import type { Snippet } from 'svelte';

	interface Props {
		class?: string;
		tooltip: string;
		onclick?: () => void;
		disabled?: boolean;
		children: Snippet;
	}

	let { class: className = '', tooltip, onclick, disabled, children }: Props = $props();
</script>

<Tooltip.Root>
	<Tooltip.Trigger aria-label={tooltip} {disabled} {onclick} class={className}>
		{@render children()}
	</Tooltip.Trigger>
	<Tooltip.Portal>
		<Tooltip.Content
			sideOffset={4}
			class="animate-scale-in data-[state=closed]:animate-scale-out bg-panel border-border z-1 border px-2 py-1 text-xs"
		>
			{tooltip}
		</Tooltip.Content>
	</Tooltip.Portal>
</Tooltip.Root>
