import { getSourceTranscript } from "../db";

/** @type {import('./$types').RequestHandler} */
export async function GET({ url }) {
	const id = String(url.searchParams.get('id'));
	const content = await getSourceTranscript(id);
	return new Response(JSON.stringify(content));
}