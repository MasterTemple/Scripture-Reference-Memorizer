import { writable } from "svelte/store";

export const device = writable('desktop');
export const isMobile = writable(true);

function checkDevice() {
  if (window.innerWidth <= 768) {
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
