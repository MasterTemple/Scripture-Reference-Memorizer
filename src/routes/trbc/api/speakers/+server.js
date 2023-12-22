import { getSpeakers } from "../db";

/** @type {import('./$types').RequestHandler} */
export async function GET({ url }) {
	const content = await getSpeakers();
	return new Response(JSON.stringify(content));
}