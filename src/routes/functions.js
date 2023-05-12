import { abbreviations, referenceRegEx, references } from "./references.js";
import { history } from "./stores.js";
const domain = "http://127.0.0.1:3000";

export function titleCase(str) {
  return (
    str.at(0).toUpperCase() +
    str.slice(1).replace(/ \w/gim, (m) => m.toUpperCase())
  );
}

export function getBookTitle(book) {
  const og = book;
  if (!book) return;
  book = titleCase(book);
  let title = Object.keys(abbreviations).find((title) => title === book);
  if (title) return title;

  book = book.toLowerCase();
  [title] = Object.entries(abbreviations).find(([title, abbr]) => abbr.includes(book)) || [];
  if (!title)
    return og;
  return title;

}

export function getChapterCountInBook(book) {
  return references[book].length - 1;
}

export function getVerseCountInChapter(reference) {
  const book = reference.match(/^.\D+(?= )/g)[0];
  const chapter = reference.match(/\d+$/g)[0];
  return references[book][chapter];
}

export async function getVerse(reference) {
  const res = await fetch(`${domain}/esv/${reference}`);
  return await res.text();
}

export function getRandomElement(array) {
  return array[Math.floor(Math.random() * array.length)];
}

// update history (using it like a stack)
export function addHistory(reference, isCorrect, guess, content) {
  history.update((old) => [{ reference, isCorrect, guess, content }, ...old]);
}

export function getPassagesFromText(text) {
  const matches = text.match(referenceRegEx);
  if (!matches) return [];
  const passages = matches.map((r) => {
    const book = r.match(/^\d?\D+[^\s\d]/g)[0];
    const rest = r.slice(book.length).replace(/\s+/g, "");
    return getBookTitle(book) + " " + rest;
  });
  return passages;
}