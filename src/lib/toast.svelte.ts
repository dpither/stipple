type ToastState = {
	message: string;
	visible: boolean;
	id: number;
};

const DEFAULT_DURATION_MS = 3000;

export const toast = $state<ToastState>({
	message: '',
	visible: false,
	id: 0
});
let hideTimeoutId: number;

export function showToast(message: string) {
	clearTimeout(hideTimeoutId);
	toast.message = message;
	toast.visible = true;
	toast.id += 1;
	hideTimeoutId = setTimeout(() => {
		toast.visible = false;
	}, DEFAULT_DURATION_MS);
}
