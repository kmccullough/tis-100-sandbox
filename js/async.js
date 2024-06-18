export function debounce(callback, tracking, delay = 0) {
  if (tracking) {
    clearTimeout(tracking);
  }
  return setTimeout(() => callback?.(), delay || 0);
}
