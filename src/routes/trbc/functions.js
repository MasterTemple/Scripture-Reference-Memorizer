const domain = "http://127.0.0.1:5173/api";

export async function get(url) {
	let res = await fetch(domain + url, {
		mode: 'cors'
	});
	return await res.json();
}

export async function getSegments(url, q, likeMatch) {
	console.log(url);
	let json = await get(url);
	console.log(json);
	// modify segments to highlight words?
	let searchTerms = q.toLowerCase().split(/ +/g).map((e) => e.replace(/[^A-z]/g, ""));
	json.sources = json.sources.map((e) => {
		let segments = [];
		// let segments = e.segments
		for (let segment of e.segments) {
			let words = segment.content.replace(/\s+/g, " ").trim().split(/ /g);
			let matchWords = words.map((w) => w.replace(/[^A-z]/g, "").toLowerCase());
			let content = [];
			matchWords.forEach((w, i) => {
				content.push({
					word: words[i],
					isMatch: likeMatch ? searchTerms.some((s) => w.match(new RegExp(`^${s}`, "i"))) : searchTerms.includes(w)
				});
			});
			segments.push({
				...segment,
				content
			});
		}
		// console.log(e.segments);
		// console.log(segments);

		return {
			segments: segments,
			source: e.source
		};
	});
	// console.log(json);
	return json;
}
export function convertFileSize(fileSize) {
	const units = ['B', 'KB', 'MB', 'GB', 'TB']; // Array of unit labels
	let size = fileSize;
	let unitIndex = 0;

	while (size >= 1024 && unitIndex < units.length - 1) {
		size /= 1024;
		unitIndex++;
	}

	return `${size.toFixed(2)} ${units[unitIndex]}`;
}

export function mergeSegments(segments) {
	let segs = [];
	let currentTime = -1;
	let currentSeg = segments[0];
	for (let seg of segments) {
		if (parseInt(seg.start_time) != currentTime) {
			segs.push(currentSeg);
			currentSeg = seg;
			currentTime = parseInt(seg.start_time);
		} else {
			currentSeg.content += " " + seg.content;
		}
	}
	segs.push(currentSeg);
	return segs.slice(1);
}