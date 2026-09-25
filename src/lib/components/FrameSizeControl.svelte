<script lang="ts">
	import { Label, Select } from 'bits-ui';

	interface Props {
		label: string;
		value: number;
		min: number;
		max: number;
		disabled: boolean;
		onChange: (newValue: number) => void;
	}

	let { label, value = $bindable(), min, max, disabled, onChange }: Props = $props();

	const options = $derived(
		Array.from({ length: max - min + 1 }, (_, i) => min + i).map((o) => ({
			value: String(o),
			label: String(o)
		}))
	);

	function handleValueChange(newValue: string) {
		onChange(parseInt(newValue, 10));
	}
</script>

<div class="flex flex-col gap-1 text-xs md:flex-row md:items-center">
	<Label.Root id="{label}-label">{label}</Label.Root>
	<Select.Root
		type="single"
		items={options}
		value={String(value)}
		onValueChange={handleValueChange}
		{disabled}
	>
		<Select.Trigger id={label} aria-labelledby="{label}-label" class="btn ps-2"
			>{value}<span class="icon-[mdi--chevron-down] size-4"></span></Select.Trigger
		>
		<Select.Portal>
			<Select.Content
				class="bg-panel border-border data-[state=open]:animate-scale-in data-[state=closed]:animate-scale-out flex w-(--bits-select-anchor-width) flex-col border p-1 text-xs outline-none"
				side="top"
				sideOffset={4}
			>
				{#each options as option (option)}
					<Select.Item
						value={option.value}
						label={option.label}
						class="transition-colors-default hocus:bg-border data-highlighted:bg-border flex w-full cursor-pointer flex-col px-2 py-1 outline-none"
						>{option.label}</Select.Item
					>
				{/each}</Select.Content
			>
		</Select.Portal></Select.Root
	>
</div>
