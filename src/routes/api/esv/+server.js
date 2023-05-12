import { config } from "dotenv";
import { getEsvText } from "../../functions";

config();
const ESV_API_KEY = process.env.ESV_API_KEY;


/** @type {import('./$types').RequestHandler} */
export async function GET({ url }) {
  const ref = String(url.searchParams.get('ref'));
  // const content = await getSingleVerse(ref);
  // return new Response(String(content));
  const content = await getEsvText(ref, ESV_API_KEY);
  return new Response(String(content));
}