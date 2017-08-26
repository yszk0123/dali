type IdGenerator = () => string;

export default function makeIdGenerator(name?: string): IdGenerator {
  let nextId = 0;
  const prefix = name ? `${name}:` : '';

  return function generateId() {
    return `${prefix}${nextId++}`;
  };
}
