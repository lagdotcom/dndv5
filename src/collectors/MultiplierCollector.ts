import AbstractCollector from "./AbstractCollector";

export default class MultiplierCollector extends AbstractCollector<number> {
  getResult(values: number[]): number {
    return values.reduce((total, value) => total * value, 1);
  }
}
