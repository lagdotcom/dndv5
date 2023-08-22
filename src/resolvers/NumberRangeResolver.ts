import ErrorCollector from "../collectors/ErrorCollector";
import Engine from "../Engine";
import Action from "../types/Action";
import Resolver from "../types/Resolver";

export default class NumberRangeResolver implements Resolver<number> {
  type: "NumberRange";

  constructor(
    public g: Engine,
    public rangeName: string,
    public min: number,
    public max: number,
  ) {
    this.type = "NumberRange";
  }

  get name() {
    const range =
      this.max === Infinity ? `${this.min}+` : `${this.min}-${this.max}`;
    return `${this.rangeName} ${range}`;
  }

  check(value: unknown, action: Action, ec: ErrorCollector) {
    if (this.min > this.max) ec.add("Invalid range", this);

    if (typeof value !== "number") ec.add("No choice", this);
    else {
      if (value < this.min) ec.add("Too low", this);
      if (value > this.max) ec.add("Too high", this);
    }

    return ec;
  }
}
