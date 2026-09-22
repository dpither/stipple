import { brailleToChar, type Braille } from '.';

export const MIN_ROWS = 1;
export const MAX_ROWS = 2;
export const MIN_COLS = 1;
export const MAX_COLS = 4;

export function createEmptyFrame(rows: number = MIN_ROWS, cols: number = MIN_COLS): Braille[][] {
	rows = Math.max(Math.min(rows, MAX_ROWS), MIN_ROWS);
	cols = Math.max(Math.min(cols, MAX_COLS), MIN_COLS);
	return Array.from({ length: rows }, () =>
		Array.from({ length: cols }, () => Array(8).fill(false) as Braille)
	);
}

export function copyFrame(frame: Braille[][]): Braille[][] {
	return frame.map((row) => row.map((braille) => [...braille]));
}

export function frameToString(frame: Braille[][]): string {
	return frame.map((row) => row.map((braille) => brailleToChar(braille)).join('')).join('\n');
}
