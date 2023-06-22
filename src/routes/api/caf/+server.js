// const { JSDOM } = require('jsdom');
import { JSDOM } from "jsdom";
function getTimeFromString(timeString) {
	const timeRegex = /(\d{1,2}):(\d{2})\s?(am|pm)/i;
	const match = timeString.match(timeRegex);

	if (match) {
		let hours = parseInt(match[1]);
		const minutes = parseInt(match[2]);
		const period = match[3].toLowerCase();

		if (period === 'pm' && hours !== 12) {
			hours += 12;
		} else if (period === 'am' && hours === 12) {
			hours = 0;
		}

		return [
			hours,
			minutes
		];
	}

	return null;
}

function toTitle(str) {
	return str.at(0).toUpperCase() + str.slice(1).replace(/\s\w/gim, (m) => m.toUpperCase());
}
async function getCafData() {

	let html = await (await fetch("https://cafebiola.cafebonappetit.com/cafe/cafe-biola/")).text();
	let { document } = (new JSDOM(html)).window;
	let data = [];
	let meals = document.querySelectorAll("section.panel.s-wrapper.site-panel.site-panel--daypart"); // all meals
	for (let meal of meals) {
		let mealName = toTitle(meal.querySelector("h2").textContent.trim());
		let times = meal.querySelector(".site-panel__daypart-time").textContent.trim();
		let [start, end] = times.split(' - ');
		let [sh, sm] = getTimeFromString(start);
		let [eh, em] = getTimeFromString(end);
		let items = [...meal.querySelectorAll("div[data-loop-index='1'] div.station-title-inline-block")].map((item) => {
			return {
				station: toTitle(item.querySelector("h3").textContent.trim()),
				food: item.querySelector("button").textContent.trim()
			};
		});
		data.push({
			mealName,
			start: [sh, sm],
			end: [eh, em],
			items
		});
	}
	return JSON.stringify(data);
}

/** @type {import('./$types').RequestHandler} */
export async function GET({ url }) {
	const content = await getCafData();
	return new Response(String(content));
}