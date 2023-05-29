type ClassnamesItem = string | Record<string, boolean>;

export default function classnames(...items: ClassnamesItem[]) {
  const names: string[] = [];

  for (const item of items) {
    if (typeof item === "string") names.push(item);
    else {
      for (const [key, value] of Object.entries(item)) {
        if (value) names.push(key);
      }
    }
  }

  return names.join(" ");
}
