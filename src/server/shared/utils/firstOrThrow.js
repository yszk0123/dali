/* @flow */

export default function firstOrThrow<T>(items: Array<?T>): T {
  const item = items[0];

  if (!item) {
    throw new Error('Item not found');
  }

  return item;
}
