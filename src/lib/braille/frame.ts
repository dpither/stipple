import { brailleToChar, type Braille } from '.';

export const MIN_ROWS = 1;
export const MAX_ROWS = 2;
export const MIN_COLS = 1;
export const MAX_COLS = 4;

export function createEmptyFrame(rows: number, cols: number): Braille[][] {
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

export function validateFrames(frames: Braille[][][]): void {
	if (frames.length === 0) {
		throw new Error('Parsed 0 frames, expected at least 1.');
	}

	for (const [i, frame] of frames.entries()) {
		if (frame.length < MIN_ROWS || frame.length > MAX_ROWS) {
			throw new Error(
				`Frame ${i + 1} invalid, expected between ${MIN_ROWS} and ${MAX_ROWS} rows got ${frame.length} `
			);
		}
		const colCount = frame[0].length;
		if (colCount < MIN_COLS || colCount > MAX_COLS) {
			throw new Error(
				`Frame ${i + 1} invalid, expected between ${MIN_COLS} and ${MAX_COLS} columns got ${colCount} `
			);
		}
		for (const row of frame) {
			if (row.length !== colCount) {
				throw new Error(`Frame ${i + 1} invalid, all rows must be equal length.`);
			}
		}
	}
}
