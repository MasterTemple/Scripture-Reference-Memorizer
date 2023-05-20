import { writable } from "svelte/store";

export const device = writable('desktop');
export const isMobile = writable(false);

function detectMobile() {
	const toMatch = [
			/Android/i,
			/webOS/i,
			/iPhone/i,
			/iPad/i,
			/iPod/i,
			/BlackBerry/i,
			/Windows Phone/i
	];
	
	return toMatch.some((toMatchItem) => {
			return navigator.userAgent.match(toMatchItem);
	});
}

export function checkDevice() {
  // console.log(window.innerWidth);
  // if (window.innerWidth < 1080) {
  // if (window.innerWidth < 1080 && window.innerWidth < window.innerHeight) {
	// if (window.innerWidth * 2 <= window.innerHeight) {
	if (detectMobile) {
    device.set('mobile');
    isMobile.set(true);
  } else {
    device.set('desktop');
    isMobile.set(false);
  }
}

if (typeof window !== 'undefined') {
  checkDevice();
  window.addEventListener('resize', checkDevice);
}
