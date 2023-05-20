import { writable } from "svelte/store";

export const device = writable('desktop');
export const isMobile = writable(false);

export function checkDevice() {
  console.log(window.innerWidth);
  if (window.innerWidth <= 768) {
    // if (window.innerWidth * 2 <= window.innerHeight) {
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
