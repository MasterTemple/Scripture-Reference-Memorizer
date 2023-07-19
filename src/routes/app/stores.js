import { writable } from 'svelte/store';

export const history = writable([]);
export const options = writable(["Romans 1:1"]);
export const optionsInput = writable("Romans 4");
// settings
export const autoFillBook = writable(true);
export const autoFillChapter = writable(true);
export const autoFillVerse = writable(false);
export const sortBibleVerses = writable(false);
export const typeVerseOut = writable(false);
export const typeFullWord = writable(false);
export const repeatVerse = writable(false);

export const typedWords = writable([]);
export const typedLetters = writable([]);

export const activePageIndex = writable(0);
