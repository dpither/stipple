<script lang="ts">
	import { Label } from 'bits-ui';

	interface Props {
		label: string;
		value: number;
		min: number;
		max: number;
		disabled: boolean;
		onIncrement: () => void;
		onDecrement: () => void;
		onChange: (newValue: number) => void;
	}

	let {
		label,
		value = $bindable(),
		min,
		max,
		disabled,
		onIncrement,
		onDecrement,
		onChange
	}: Props = $props();
</script>

<div class="flex flex-col gap-1 text-xs md:flex-row md:items-center">
	<Label.Root id="{label}-label" for={label} class="select-none">{label}</Label.Root>
	<div class="flex h-full items-center gap-1">
		<input
			bind:value
			{disabled}
			onchange={(e) => {
				onChange(parseInt(e.currentTarget.value) || min);
			}}
			id={label}
			aria-labelledby="{label}-label"
			{min}
			{max}
			type="number"
			class="transition-colors-default border-border focus-visible:border-accent disabled:text-border box-content size-4 border p-1 outline-none disabled:pointer-events-none"
		/>
		{#snippet stepperButton(
			label: string,
			isDisabled: boolean,
			onclick: () => void,
			symbol: string
		)}
			<button
				class="transition-colors-default border-border hover:border-accent hover:bg-border hover:text-accent disabled:text-border box-content flex h-1/2 w-4 cursor-pointer items-center justify-center border p-1 leading-0 disabled:pointer-events-none"
				aria-label={label}
				tabindex="-1"
				disabled={isDisabled}
				{onclick}>{symbol}</button
			>
		{/snippet}
		<div class="flex h-full flex-col">
			{@render stepperButton('increment cols', value === max || disabled, onIncrement, '+')}
			{@render stepperButton('decrement cols', value === min || disabled, onDecrement, '-')}
		</div>
	</div>
</div>
