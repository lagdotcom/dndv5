import AttackOutcome from "../types/AttackOutcome";
import { AbstractSumCollector } from "./AbstractCollector";

export default class AttackOutcomeCollector extends AbstractSumCollector<AttackOutcome> {
  defaultGet?: () => AttackOutcome;

  setDefaultGetter(getter: () => AttackOutcome) {
    this.defaultGet = getter;
    return this;
  }

  getDefaultResult() {
    if (this.defaultGet) return this.defaultGet();
    throw new Error("AttackOutcomeCollector.setDefaultGetter() not called");
  }

  getSum(values: AttackOutcome[]) {
    if (values.includes("miss")) return "miss";
    if (values.includes("critical")) return "critical";
    if (values.includes("hit")) return "hit";

    return this.getDefaultResult();
  }

  get hits() {
    return this.result !== "miss";
  }
}
