/* @flow */

export default function isTouchSupported(): boolean {
  return 'ontouchstart' in window || navigator.msMaxTouchPoints;
}
