import { Resolver } from "../types/Action";

export default class SlotResolver implements Resolver<number> {
  type: "SpellSlot";

  constructor(public minimum: number) {
    this.type = "SpellSlot";
  }

  check(value: unknown): value is number {
    // TODO caster spell slots...???
    return typeof value === "number" && value >= this.minimum && value <= 9;
  }
}
