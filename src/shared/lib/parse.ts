export function parseEnumValue<T extends string>(
  value: string | null | undefined,
  allowed: readonly T[],
): T | null {
  return allowed.find((item) => item === value) ?? null
}
