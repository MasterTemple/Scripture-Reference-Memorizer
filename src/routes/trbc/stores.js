import { writable } from "svelte/store";

export const page = writable(1);
export const extraContext = writable(20);
export const likeMatch = writable(false);
export const blockStopWords = writable(true);
export const roundingNumber = writable(20);
export const input = writable("");
export const results = writable({
	pageSize: 1,
	sources: []
});

export const searchIndex = writable(0);

export function reload() {
	searchIndex.update((s) => s + 1);
}

export const direction = writable("up");
export const isSearching = writable(false);

export const currentTime = writable(0.0);
export const playbackRate = writable(1);
export const trackCurrentLine = writable(true);
export const isPaused = writable(true);


export const selectedSpeakers = writable([]);
export const selectedSeries = writable([]);