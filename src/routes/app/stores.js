import { writable } from 'svelte/store';

export const history = writable([]);
export const options = writable(["Romans 1:1"]);
// settings
export const autoFillBook = writable(true);
export const autoFillChapter = writable(true);
export const sortBibleVerses = writable(false);

export const activePageIndex = writable(0);