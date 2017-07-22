/* @flow */

export default function isTouchSupported(): boolean {
  return window.DocumentTouch && document instanceof window.DocumentTouch;
}
