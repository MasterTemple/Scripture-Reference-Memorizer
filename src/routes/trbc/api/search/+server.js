import { searchDatabase } from "../db";

/** @type {import('./$types').RequestHandler} */
export async function GET({ url }) {
	const params = url.searchParams;

	let query = {
		q: params.get("q"),
		p: params.get("p"),
		c: params.get("c"),
		b: params.get("b"),
		l: params.get("l"),
		r: params.get("r"),
		sr: params.get("sr"),
		sp: params.get("sp"),
	};
	console.log({ query });
	const content = await searchDatabase(query);

	return new Response(JSON.stringify(content));
}