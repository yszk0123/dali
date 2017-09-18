export default function toNonEmptyArray<T>(input: (T | null)[]): T[] {
  return (input as any).filter((e: any) => e);
}
