/*
  Braille Unicode dot layout:
    1 4
    2 5
    3 6
    7 8

  Unicode codepoint = 0x2800 + bitmask of dots
*/

import { type Braille } from '.';

export const GRID_TO_DOT = [0, 3, 1, 4, 2, 5, 6, 7];
const BRAILLE_START = 0x2800;
const BRAILLE_END = 0x28ff;

export function brailleToChar(braille: Braille): string {
	let mask = 0;
	braille.forEach((active, i) => {
		if (active) mask |= 1 << i;
	});
	return String.fromCharCode(0x2800 + mask);
}

export function brailleToByte(braille: Braille): number {
	let byte = 0;
	for (let i = 0; i < 8; i++) {
		if (braille[i]) byte |= 1 << i;
	}
	return byte;
}

export function byteToBraille(byte: number): Braille {
	const braille = new Array(8) as Braille;
	for (let i = 0; i < 8; i++) {
		braille[i] = (byte & (1 << i)) !== 0;
	}
	return braille;
}

export function charToBraille(char: string): Braille {
	if (!isBrailleChar(char)) {
		throw new Error(`"${char}" is not a valid braille character.`);
	}
	const mask = char.codePointAt(0)! - 0x2800;
	return Array.from({ length: 8 }, (_, i) => Boolean(mask & (1 << i))) as Braille;
}

export function isBrailleChar(char: string): boolean {
	if (Array.from(char).length !== 1) return false;
	const codePoint = char.codePointAt(0)!;
	return codePoint >= BRAILLE_START && codePoint <= BRAILLE_END;
}
