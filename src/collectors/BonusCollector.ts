import { AbstractSumCollector } from "./CollectorBase";

export default class BonusCollector<
  T extends number = number,
> extends AbstractSumCollector<number, T> {
  getSum(values: number[]) {
    return values.reduce((total, value) => total + value, 0) as T;
  }
}
