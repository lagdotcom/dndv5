import ErrorCollector from "../collectors/ErrorCollector";
import Engine from "../Engine";
import { PickChoice } from "../interruptions/PickFromListChoice";
import Action from "../types/Action";
import Resolver from "../types/Resolver";

export default class ChoiceResolver<T> implements Resolver<T> {
  type: "Choice";

  constructor(
    public g: Engine,
    public entries: PickChoice<T>[],
  ) {
    this.type = "Choice";
  }

  get name() {
    if (this.entries.length === 0) return "empty";
    return `One of: ${this.entries.map((e) => e.label).join(", ")}`;
  }

  check(value: unknown, action: Action, ec: ErrorCollector) {
    if (this.entries.length === 0) ec.add("No valid choices", this);
    else if (!value) ec.add("No choice made", this);
    else if (!this.entries.find((e) => e.value === value))
      ec.add("Invalid choice", this);

    return ec;
  }
}
