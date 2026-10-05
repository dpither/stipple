export function initKeyboardShortcuts(
	togglePlay: () => void,
	isPlaying: () => boolean,
	nextFrame: () => void,
	prevFrame: () => void,
	addFrame: () => void,
	duplicateFrame: () => void,
	deleteFrame: () => void
): () => void {
	function handleKeydown(e: KeyboardEvent) {
		const activeElement = document.activeElement;

		if (activeElement?.tagName === 'INPUT') {
			return;
		}

		// Toggle Play:     Space
		// Next Frame:      .
		// Prev Frame:      ,
		// New Frame:       N
		// Duplicate Frame: D
		// Delete Frame:    Delete

		if (e.key === ' ' && !activeElement?.matches(':focus-visible')) {
			e.preventDefault();
			togglePlay();
		} else if (!isPlaying() && e.key === '.') {
			nextFrame();
		} else if (!isPlaying() && e.key === ',') {
			prevFrame();
		} else if (e.key === 'N') {
			addFrame();
		} else if (!isPlaying() && e.key === 'D') {
			duplicateFrame();
		} else if (!isPlaying() && e.key === 'Delete') {
			deleteFrame();
		}
	}

	window.addEventListener('keydown', handleKeydown);
	return () => window.removeEventListener('keydown', handleKeydown);
}
