import {
	brailleToChar,
	charToBraille,
	MAX_COLS,
	MAX_ROWS,
	MIN_COLS,
	MIN_ROWS,
	type Braille
} from '.';

export const MIN_FRAMES = 1;
export const MAX_FRAMES = 200;

export function validateFrames(frames: Braille[][][]): void {
	if (frames.length === 0) {
		throw new Error(`Parsed 0 frames, minimum is ${MIN_FRAMES}.`);
	}

	if (frames.length > MAX_FRAMES) {
		throw new Error(`Parsed ${frames.length} frames, maximum is ${MAX_FRAMES}.`);
	}

	for (const [i, frame] of frames.entries()) {
		if (frame.length < MIN_ROWS || frame.length > MAX_ROWS) {
			throw new Error(
				`Frame ${i + 1} invalid, expected between ${MIN_ROWS} and ${MAX_ROWS} rows got ${frame.length}.`
			);
		}
		const colCount = frame[0].length;
		if (colCount < MIN_COLS || colCount > MAX_COLS) {
			throw new Error(
				`Frame ${i + 1} invalid, expected between ${MIN_COLS} and ${MAX_COLS} columns got ${colCount}.`
			);
		}
		for (const row of frame) {
			if (row.length !== colCount) {
				throw new Error(`Frame ${i + 1} invalid, all rows must be equal length.`);
			}
		}
	}
}

// Plain Text
export function framesToPlainText(frames: Braille[][][]): string {
	return frames
		.map((frame) => frame.map((row) => row.map(brailleToChar).join('')).join('\n'))
		.join('\n\n');
}

function plainTextToFrames(text: string): Braille[][][] {
	const textBlocks = text.split(/\n\s*\n/);
	const frames = textBlocks.map((textBlock) =>
		textBlock.split('\n').map((rowString) => Array.from(rowString).map(charToBraille))
	);
	validateFrames(frames);
	return frames;
}

// JSON
export function framesToJSON(frames: Braille[][][]): string {
	return JSON.stringify(frames.map((frame) => frame.map((row) => row.map(brailleToChar).join(''))));
}

function jsonToFrames(json: string): Braille[][][] {
	let parsed: unknown;
	try {
		parsed = JSON.parse(json);
	} catch {
		throw new Error('Invalid JSON.');
	}

	if (
		!Array.isArray(parsed) ||
		!parsed.every((frame) => Array.isArray(frame) && frame.every((row) => typeof row === 'string'))
	) {
		throw new Error('Expected an 2D array of strings.');
	}
	const frames = (parsed as string[][]).map((frame) =>
		frame.map((row) => Array.from(row).map(charToBraille))
	);

	validateFrames(frames);
	return frames;
}

export function parseInput(input: string): Braille[][][] {
	// Try JSON
	if (input.startsWith('[')) {
		try {
			const frames = jsonToFrames(input);
			return frames;
		} catch (e) {
			throw e;
		}
	}

	// Try Plain Text
	return plainTextToFrames(input);
}
