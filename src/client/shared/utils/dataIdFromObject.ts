export default function dataIdFromObject(obj: any): string {
  return `${obj.__typename}:${obj.id}`;
}
