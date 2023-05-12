import { config } from "dotenv";

config();
const ESV_API_KEY = process.env.ESV_API_KEY;


/** @type {import('./$types').RequestHandler} */
export async function GET({ url }) {
  const ref = String(url.searchParams.get('ref'));
  // const content = await getSingleVerse(ref);
  // return new Response(String(content));
  // const content = await getEsvText(ref, ESV_API_KEY);
  const content = await getSingleVerseFromServer(ref);
  return new Response(String(content));
}

import sqlite from "sqlite3";
sqlite.verbose();
const db = new sqlite.Database("ESV.sqlite");

async function getSingleVerseFromServer(ref) {
  const book = ref.match(/^.\D+(?= )/g)?.[0];
  const chapter = ref.match(/\d+(?=:)/g)?.[0];
  const verse = ref.match(/\d+$/g)?.[0];
  return new Promise((resolve) => {
    db.get(
      `SELECT * FROM '${book}' WHERE chapter=${chapter} AND verse=${verse} ORDER BY verse ASC;`,
      (_, row) => {
        resolve(row.content);
      }
    );
  });
}