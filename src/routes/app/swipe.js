export function swipe(node, { onSwipeLeft, onSwipeRight }) {
  let startX;

  function handleTouchStart(event) {
    startX = event.touches[0].clientX;
  }

  function handleTouchEnd(event) {
    const endX = event.changedTouches[0].clientX;
    const diffX = startX - endX;

    if (diffX > 50 && onSwipeLeft) {
      onSwipeLeft();
    } else if (diffX < -50 && onSwipeRight) {
      onSwipeRight();
    }
  }

  node.addEventListener("touchstart", handleTouchStart);
  node.addEventListener("touchend", handleTouchEnd);

  return {
    destroy() {
      node.removeEventListener("touchstart", handleTouchStart);
      node.removeEventListener("touchend", handleTouchEnd);
    },
  };
}