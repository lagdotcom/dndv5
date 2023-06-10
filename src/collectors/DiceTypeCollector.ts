import DiceType from "../types/DiceType";
import { AbstractSumCollector } from "./AbstractCollector";

export default class DiceTypeCollector extends AbstractSumCollector<DiceType> {
  getSum(values: DiceType[]): DiceType {
    const hasAdvantage = values.includes("advantage");
    const hasDisadvantage = values.includes("disadvantage");

    if (hasAdvantage === hasDisadvantage) return "normal";
    return hasAdvantage ? "advantage" : "disadvantage";
  }
}
