export function toggleItem<T>(arr: T[], item: T) {
  if (arr.includes(item)) {
    return arr.filter(v => v !== item);
  }
  return [...arr, item];
}

export function groupBy<T>(items: T[], cb: (item: T) => string): Record<string, T[]> {
  return items.reduce((acc, item) => {
    const key = cb(item) as keyof typeof acc;
    return {
      ...acc,
      [key]: acc[key] ? [...acc[key], item] : [item],
    };
  }, {});
}
