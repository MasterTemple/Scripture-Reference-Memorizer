import { writable } from 'svelte/store';

export const history = writable([]);
export const options = writable(["1 Peter 1:1"]);
export const optionsInput = writable("1 Peter 1");
// settings
export const autoFillBook = writable(true);
export const autoFillChapter = writable(true);
export const autoFillVerse = writable(false);

export const sortBibleVerses = writable(false);
export const startAtBegininng = writable(false);

export const typeVerseOut = writable(false);
export const typeFullWord = writable(false);
export const repeatVerse = writable(false);

export const typedWords = writable([]);
export const typedLetters = writable([]);

export const activePageIndex = writable(0);

// ---------------------------------------------------------------
// 2️⃣ Store that tracks which indices have already been asked
// ---------------------------------------------------------------
function createAskedTracker() {
	// a Set of numeric indices – fast O(1) lookup
	const { subscribe, set, update } = writable(new Set());

	return {
		subscribe,
		// add an index to the set
		add: (i) => update(s => (s.add(i), s)),
		// clear the whole set (used when options change or when we exhausted the list)
		reset: () => set(new Set()),
		// expose the raw Set for read‑only checks
		get: () => get({ subscribe })
	};
}
export const asked = createAskedTracker();

// ---------------------------------------------------------------
// 5️⃣ React to changes in `options` – clear the tracker automatically
// ---------------------------------------------------------------
options.subscribe(() => {
	// When the array itself changes (different length or content) start a new round
	asked.reset();
});
