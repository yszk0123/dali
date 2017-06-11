export default function makeIdGenerator(name = null) {
  let nextId = 0;
  const prefix = name ? `${name}:` : '';

  return function generateId() {
    return `${prefix}${nextId++}`;
  };
}
