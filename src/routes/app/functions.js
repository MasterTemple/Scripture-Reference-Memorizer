// import { config } from "dotenv";
import { abbreviations, referenceRegEx, references } from "./references.js";
import { history } from "./stores.js";

// config();
// const ESV_API_KEY = process.env.ESV_API_KEY;
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
  const res = await fetch(`/api/esv?ref=${reference}`);
  return await res.text();
}

export function getRandomElement(array) {
  return array[Math.floor(Math.random() * array.length)];
}

// update history (using it like a stack)
let id = 1;
export function addHistory(reference, isCorrect, guess, content) {
  history.update((old) => [{ id, reference, isCorrect, guess, content }, ...old]);
  id++;
}

export function clearHistory() {
  history.set([]);
}

export function getPassagesFromText(text) {
  const matches = text.replace(/\./g, "").match(referenceRegEx);
  if (!matches) return [];
  const passages = matches.map((r) => {
    const book = r.match(/^\d?\D+[^\s\d]/g)[0].replace(/\./g, "");
    const rest = r.slice(book.length).replace(/\s+/g, "");
    return getBookTitle(book) + " " + rest;
  });
  return passages;
}

export async function getEsvText(passage, ESV_API_KEY) {
  const API_URL = 'https://api.esv.org/v3/passage/text/';

  const params = {
    q: passage,
    include_headings: false,
    include_footnotes: false,
    include_verse_numbers: false,
    include_short_copyright: false,
    include_passage_references: false
  };

  const parameters = Object.entries(params).map(([k, v]) => `${k}=${v}`).join("&");

  const headers = {
    Authorization: `Token ${ESV_API_KEY}`
  };

  try {
    const response = await fetch(`${API_URL}?${parameters}`, { headers });
    const json = await response.json();
    const passages = json.passages;

    return passages.length > 0 ? passages[0].trim() : 'Error: Passage not found';
  } catch (err) {
    console.error(err.message);
    return 'Error: Failed to fetch passage';
  }
}