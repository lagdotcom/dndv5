import { Multiplier } from "../flavours";
import { AbstractSumCollector } from "./CollectorBase";

export type MultiplierType = "double" | "half" | "normal" | "zero";

export default class MultiplierCollector extends AbstractSumCollector<
  MultiplierType,
  Multiplier
> {
  getSum(values: MultiplierType[]): Multiplier {
    let power = 0;

    for (const value of values) {
      if (value === "double") power++;
      else if (value === "half") power--;
      else if (value === "zero") return 0;
    }

    return 2 ** power;
  }
}
