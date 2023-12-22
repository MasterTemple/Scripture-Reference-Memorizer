import { getSeries } from "../db";

/** @type {import('./$types').RequestHandler} */
export async function GET({ url }) {
	const content = await getSeries();
	return new Response(JSON.stringify(content));
}