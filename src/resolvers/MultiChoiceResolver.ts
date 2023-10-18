import ErrorCollector from "../collectors/ErrorCollector";
import Engine from "../Engine";
import { PickChoice } from "../interruptions/PickFromListChoice";
import Action from "../types/Action";
import Resolver from "../types/Resolver";
import { describeRange } from "../utils/text";

export default class MultiChoiceResolver<T> implements Resolver<T[]> {
  type: "Choices";

  constructor(
    public g: Engine,
    public entries: PickChoice<T>[],
    public minimum: number,
    public maximum: number,
  ) {
    this.type = "Choices";
  }

  get name() {
    if (this.entries.length === 0) return "empty";
    return `${describeRange(this.minimum, this.maximum)}: ${this.entries
      .map((e) => e.label)
      .join(", ")}`;
  }

  check(value: unknown, action: Action, ec: ErrorCollector) {
    if (this.entries.length === 0) ec.add("No valid choices", this);
    else if (!Array.isArray(value)) ec.add("No choices", this);
    else {
      if (value.length < this.minimum)
        ec.add(`At least ${this.minimum} choices`, this);
      if (value.length > this.maximum)
        ec.add(`At most ${this.maximum} choices`, this);
    }

    return ec;
  }
}
