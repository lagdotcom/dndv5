import DiceType from "../types/DiceType";
import AbstractCollector from "./AbstractCollector";

export default class DiceTypeCollector extends AbstractCollector<DiceType> {
  getResult(values: DiceType[]): DiceType {
    const hasAdvantage = values.includes("advantage");
    const hasDisadvantage = values.includes("disadvantage");

    if (hasAdvantage === hasDisadvantage) return "normal";
    return hasAdvantage ? "advantage" : "disadvantage";
  }
}
