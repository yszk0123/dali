/* @flow */

export default function isTouchSupported(): boolean {
  // Note: Workaround to avoid missing property error
  // https://github.com/facebook/flow/issues/396#issuecomment-263186875
  return 'ontouchstart' in window || (navigator: any).msMaxTouchPoints;
}
