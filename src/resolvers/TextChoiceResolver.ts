import ErrorCollector from "../collectors/ErrorCollector";
import Engine from "../Engine";
import Action, { Resolver } from "../types/Action";

export default class TextChoiceResolver<T extends string>
  implements Resolver<T>
{
  type: "Text";
  values: Set<T>;

  constructor(public g: Engine, choices: T[]) {
    this.type = "Text";
    this.values = new Set(choices);
  }

  get name() {
    return `One of: ${[...this.values].join(", ")}`;
  }

  check(value: unknown, action: Action, ec = new ErrorCollector()) {
    if (!value) ec.add("No choice made", this);
    else if (!this.values.has(value as T)) ec.add("Invalid choice", this);

    return ec;
  }
}
