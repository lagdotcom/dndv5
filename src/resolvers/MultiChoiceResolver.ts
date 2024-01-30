import ErrorCollector from "../collectors/ErrorCollector";
import Engine from "../Engine";
import { PickChoice } from "../interruptions/PickFromListChoice";
import Action from "../types/Action";
import Resolver from "../types/Resolver";
import { plural } from "../utils/text";

export default class MultiChoiceResolver<T> implements Resolver<T[]> {
  type: "Choices";

  constructor(
    public g: Engine,
    public name: string,
    public entries: PickChoice<T>[],
    public minimum: number,
    public maximum: number,
  ) {
    this.type = "Choices";
  }

  check(value: unknown, action: Action, ec: ErrorCollector) {
    if (this.entries.length === 0) ec.add("No valid choices", this);
    else if (!Array.isArray(value)) ec.add("No choices", this);
    else {
      if (value.length < this.minimum)
        ec.add(
          `At least ${this.minimum} ${plural("choice", this.minimum)}`,
          this,
        );
      if (value.length > this.maximum)
        ec.add(
          `At most ${this.maximum} ${plural("choice", this.maximum)}`,
          this,
        );
    }

    return ec;
  }
}
