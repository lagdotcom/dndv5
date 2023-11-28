import Gain from "../types/Gain";
import { SetInitialiser } from "./set";

export function gains<T>(fixed: T[], amount?: number, set?: SetInitialiser<T>) {
  const result: Gain<T>[] = fixed.map((value) => ({ type: "static", value }));

  if (amount && set) result.push({ type: "choice", amount, set: new Set(set) });

  return result;
}
