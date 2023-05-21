import Engine from "../Engine";
import { Resolver } from "../types/Action";

export default class TextChoiceResolver<T extends string>
  implements Resolver<T>
{
  values: Set<T>;

  constructor(public g: Engine, choices: T[]) {
    this.values = new Set(choices);
  }

  check(value: unknown): value is T {
    return typeof value === "string" && this.values.has(value as T);
  }
}
