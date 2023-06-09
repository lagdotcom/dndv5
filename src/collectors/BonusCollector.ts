import { AbstractSumCollector } from "./AbstractCollector";

export default class BonusCollector extends AbstractSumCollector<number> {
  getSum(values: number[]): number {
    return values.reduce((total, value) => total + value, 0);
  }
}
