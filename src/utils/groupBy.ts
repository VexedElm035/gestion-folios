export const groupBy = <T, K>(items: readonly T[], getKey: (item: T) => K) => {
  const map = new Map<K, T[]>()
  for (const item of items) {
    const key = getKey(item)
    const existing = map.get(key)
    if (existing) existing.push(item)
    else map.set(key, [item])
  }
  return map
}
