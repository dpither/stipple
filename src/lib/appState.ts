import type { Braille } from './braille';
import {
	MIN_COLS,
	MAX_COLS,
	MIN_ROWS,
	MAX_ROWS,
	validateFrames,
	brailleToByte,
	MIN_FRAMES,
	MAX_FRAMES,
	byteToBraille
} from './braille';

export const MIN_FPS = 1;
export const MAX_FPS = 60;
export const DEFAULT_FPS = 12;

interface AppState {
	frames: Braille[][][];
	fps: number;
}

const DEBOUNCE_TIMEOUT = 500;
let debounceTimer = -1;

function validateState(state: AppState): void {
	const { frames, fps } = state;

	if (!Number.isInteger(fps) || fps < MIN_FPS || fps > MAX_FPS) {
		throw new Error(`FPS invalid, expected between ${MIN_FPS} and ${MAX_FPS} got ${fps}.`);
	}
	validateFrames(frames);
}

// Encode
function encodeStateToBytes(state: AppState): Uint8Array {
	validateState(state);
	const { frames, fps } = state;
	const bytes: number[] = [fps, frames.length];

	for (const frame of frames) {
		const rows = frame.length;
		const cols = frame[0]!.length;
		bytes.push((rows << 4) | cols);
		for (const row of frame) {
			for (const braille of row) {
				bytes.push(brailleToByte(braille));
			}
		}
	}
	return new Uint8Array(bytes);
}

function encodeStateToHash(state: AppState): string {
	const binString = Array.from(encodeStateToBytes(state), (byte) => String.fromCharCode(byte)).join(
		''
	);
	return btoa(binString).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

// Decode
function decodeStateFromBytes(bytes: Uint8Array): AppState | null {
	if (bytes.length < 2) return null;

	let offset = 0;
	const fps = bytes[offset++];
	if (fps < MIN_FPS || fps > MAX_FPS) null;

	const numFrames = bytes[offset++];
	if (numFrames < MIN_FRAMES || numFrames > MAX_FRAMES) return null;

	const frames: Braille[][][] = [];
	for (let i = 0; i < numFrames; i++) {
		if (offset >= bytes.length) return null;

		const dims = bytes[offset++];
		const rows = dims >> 4;
		const cols = dims & 0x0f;

		if (rows < MIN_ROWS || rows > MAX_ROWS) return null;
		if (cols < MIN_COLS || cols > MAX_COLS) return null;
		const frame: Braille[][] = [];
		for (let r = 0; r < rows; r++) {
			const row: Braille[] = [];
			for (let c = 0; c < cols; c++) {
				if (offset >= bytes.length) return null;
				row.push(byteToBraille(bytes[offset++]));
			}
			frame.push(row);
		}
		frames.push(frame);
	}

	if (offset !== bytes.length) return null;
	return { frames, fps };
}

export function decodeStateFromHash(hash: string): AppState | null {
	if (!hash) return null;

	try {
		let base64 = hash.replace(/-/g, '+').replace(/_/g, '/');
		while (base64.length % 4) base64 += '=';
		const binString = atob(base64);
		const bytes = Uint8Array.from(binString, (c) => c.charCodeAt(0));
		return decodeStateFromBytes(bytes);
	} catch (e) {
		return null;
	}
}

export function syncStateToURL(state: AppState): void {
	clearTimeout(debounceTimer);
	debounceTimer = setTimeout(() => {
		try {
			const hash = encodeStateToHash(state);
			history.replaceState({}, '', `#${hash}`);
		} catch (e) {
			console.error('Failed to sync state to URL:', e);
		}
	}, DEBOUNCE_TIMEOUT);
}

export function readStateFromURL(): AppState | null {
	const hash = location.hash.slice(1);
	return decodeStateFromHash(hash);
}

export function onURLStateChange(callback: (state: AppState | null) => void): () => void {
	const handler = () => callback(readStateFromURL());
	window.addEventListener('hashchange', handler);
	return () => window.removeEventListener('hashchange', handler);
}
