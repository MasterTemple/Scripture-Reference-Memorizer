import mysql from 'mysql2/promise';
import credentials from './credentials.json';
import stopWords from './stop.json';
// const mysql = require('mysql2/promise');

// const credentials = require("./credentials.json");

var connection;
mysql.createConnection(credentials).then((con) => connection = con);
// const stopWords = require("./stop.json");

function round(n, roundingNumber) {
	return Math.round(n / roundingNumber) * roundingNumber;
}

const pageSize = 10;
function paginate(arr, page) {
	const startIndex = (page - 1) * pageSize;
	const endIndex = startIndex + pageSize;
	return arr.slice(startIndex, endIndex);
}

function getSmallestAndLargest(arr) {
	let smallest = arr[0];
	let largest = smallest;
	for (let a of arr) {
		if (a > largest) largest = a;
		if (a < smallest) smallest = a;
	}
	return [smallest, largest];
}

function getRange(arr) {
	let [s, l] = getSmallestAndLargest(arr);
	return l - s;
}

function compareRange(arr1, arr2) {
	return getRange(arr1.numbers) - getRange(arr2.numbers);
}

async function getSegmentRange(start, end) {
	const arr = [];
	for (let i = start; i <= end; i++) arr.push(i);
	const query = `SELECT * FROM segments where id in (${arr.join(',')}) order by id`;
	// const query = `SELECT * FROM segments where id > ${start} or id < ${end} order by id`; // that is slow
	const [rows] = await connection.query(query);
	return rows;
}

export async function getSourceById(id) {
	const query = `
SELECT sermons.*, series.name as seriesName, speakers.name as speakerName
FROM sermons
LEFT JOIN series on sermons.series_id = series.id
JOIN speakers on sermons.speaker_id = speakers.id
where sermons.id = ${id}	`;
	const [rows] = await connection.query(query);
	// console.log(rows);
	return rows?.[0] || {};
}

export async function getSpeakers() {
	const query = `SELECT * FROM speakers`;
	const [rows] = await connection.query(query);
	return rows || [];
}

export async function getSeries() {
	const query = `SELECT * FROM series`;
	const [rows] = await connection.query(query);
	return rows || [];
}

async function getSeriesValidSegments(series_ids) {
	const query = `select start_segment, end_segment from sermons where series_id in (${series_ids.join(',')}) and start_segment != -1;`;
	const [rows] = await connection.query(query);
	const segs = rows.map(e => Object.values(e)); // convert to array
	return segs || [];
}

async function getSpeakersValidSegments(speaker_ids) {
	const query = `select start_segment, end_segment from sermons where speaker_id in (${speaker_ids.join(',')}) and start_segment != -1;
`;
	const [rows] = await connection.query(query);
	const segs = rows.map(e => Object.values(e)); // convert to array
	return segs || [];
}



export async function getSourceTranscript(sourceId) {
	// const query = `select * from segments where id >= 1 and id <= 623 order by id;`;
	const query = `select * from segments where id >= (select start_segment from sermons where id = ${sourceId}) and id < (select end_segment from sermons where id = ${sourceId}) order by id;`;
	const [rows] = await connection.query(query);
	return rows;
}

function getSynonyms(word) {
	// ! incomplete
	if (word == "elder")
		return ['bishop', 'overseer', 'pastor', 'preacher'];
	return [];
}

export async function searchDatabase(params) {
	// console.log(req.query);
	let q = params.q.replace(/'/g, "");
	let page = params.p || 1;
	let giveExtraContext = params?.c || 1;
	let blockStopWords = params?.b === 'true';
	let likeMatch = params?.l === 'true';
	let roundingNumber = params?.r || 10;
	let series = params?.sr?.split(',').filter(e => e != "") || [];
	let speakers = params?.sp?.split(',').filter(e => e != "") || [];
	console.log({ page, giveExtraContext, blockStopWords });

	let words = q.split(/ /g);
	if (blockStopWords)
		words = words.filter((w) => !stopWords.includes(w));
	let synonymMatching = false;
	if (synonymMatching) {
		// ! also return these words so that the UI knows what words to highlight
		let arr = [];
		for (let word of words) {
			arr.push(word);
			arr.push(...getSynonyms(word));
		}
		words = arr;
	}
	// console.log(words);
	let wordMatch = words.map((w) => `word ${likeMatch ? 'like' : '='} '${w}${likeMatch ? '%' : ''}'`).join(" or ");
	const query = `SELECT * FROM searches where (${wordMatch})`;
	// Execute a SQL query to fetch todos from the database
	let startTime = new Date();
	// connection = await mysql.createConnection(credentials);
	const [rows] = await connection.query(query);
	let endTime = new Date();
	console.log(`Query took: ${endTime - startTime}ms`);
	startTime = new Date();


	let map = {};
	rows.forEach((r) => {
		if (map[r.word]) {
			map[r.word].push(...r.segments.split(';').map(e => parseInt(e)));
		} else {
			map[r.word] = r.segments.split(';').map(e => parseInt(e));
		}
	});
	// console.log(map);

	let roundedMap = {};
	Object.entries(map).forEach(([k, v]) => {
		for (let e of v) {
			// rounds to nearby
			let r = round(e, roundingNumber);
			// if it is close to other bound
			// if(roundingNumber - (e % roundingNumber) <=  2){

			// }
			// console.log({ e, r2 });

			if (roundedMap[r]) {
				if (!roundedMap[r]['words'].includes(k)) {
					roundedMap[r]['count']++;
					// duplicates mean i must search through more later
					if (!roundedMap[r]['numbers'].includes(e))
						roundedMap[r]['numbers'].push(e);
					roundedMap[r]['words'].push(k);
				}
			} else {
				roundedMap[r] = {
					count: 1,
					numbers: [e],
					words: [k]
				};
			}
		}
	});


	// convert object to array sorted by word match count
	let results = Object.values(roundedMap).sort((a, b) => b.count - a.count);
	// sort by smallest range grouped by largest match
	let r = {};
	for (let res of results) {
		if (!r[res.count]) r[res.count] = [res];
		else r[res.count].push(res);
	}
	r = Object.values(r).reverse();
	r = r.map(e => e.sort(compareRange));
	results = r.flat();

	// filter by series if one or more
	let validSegments = [];
	let speakerSegments = [];
	let seriesSegments = [];
	let joinType = "and";
	if (series.length > 0) {
		seriesSegments = await getSeriesValidSegments(series);
	}
	if (speakers.length > 0) {
		speakerSegments = await getSpeakersValidSegments(speakers);
	}
	if (joinType == "and") {
		// just one filter implies other accepts all
		if (speakerSegments.length === 0)
			validSegments = seriesSegments;
		else if (seriesSegments.length === 0)
			validSegments = speakerSegments;
		// merge
		else {
			for (let speakerSegment of speakerSegments) {
				// have same start (which implies same end)
				if (seriesSegments.some(([start]) => start == speakerSegment[0]))
					validSegments.push(speakerSegment);

			}
		}
	}
	else {
		validSegments.push(...speakerSegments);
		validSegments.push(...seriesSegments);
	}
	// console.log({ validSegments });
	// console.log(results);
	if (validSegments.length > 0) {
		results = results.filter((res) => {
			// if res.number within a list of ranges
			return validSegments.some(([start, end]) => start <= res.numbers[0] && res.numbers[0] <= end);
		});
	}

	// paginate
	let pageResults = paginate(results, page);
	let pages = Math.round(results.length / pageSize) + ((results % pageSize) > 0 ? 1 : 0);
	if (pages === 0) pages = 1;
	let json = {
		pageSize: pages,
		sources: []
	};

	// endTime = new Date();
	// console.log(`Here: ${endTime - startTime}ms`);
	// startTime = new Date();

	for (let pr of pageResults) {
		let [start, end] = getSmallestAndLargest(pr.numbers);
		for (let i = 0; i < giveExtraContext; i++) {
			start--;
			end++;
		}
		let segments = await getSegmentRange(start, end);
		let sermon_id = segments[0].sermon_id;

		// there are 2 sources next to each other

		const sourceChangeIndex = segments.findIndex(s => s.segment_order === 1);
		if (sourceChangeIndex > 0) {

			sermon_id = sourceChangeIndex > parseInt(segments.length / 2) ?
				segments[0].sermon_id : segments[sourceChangeIndex].sermon_id;
			segments = segments.filter((f) => f.sermon_id === sermon_id);

		}

		const source = await getSourceById(sermon_id);

		json.sources.push({
			source,
			segments
		});
	}
	endTime = new Date();
	console.log(`Algorithm took: ${endTime - startTime}ms`);
	return json;
}
