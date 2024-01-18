import { objectEntries } from "../../utils/objects";
import { isDefined } from "../../utils/types";

type ClassnamesItem = string | Record<string, boolean> | undefined;

export default function classnames(...items: ClassnamesItem[]) {
  const names: string[] = [];

  for (const item of items) {
    if (!isDefined(item)) continue;
    else if (typeof item === "string") names.push(item);
    else {
      for (const [key, value] of objectEntries(item)) {
        if (value) names.push(key);
      }
    }
  }

  return names.join(" ");
}
