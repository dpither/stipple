import { brailleToChar, charToBraille, validateFrames, type Braille } from '.';

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
