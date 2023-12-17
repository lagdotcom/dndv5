import AttackOutcome from "../types/AttackOutcome";
import { AbstractSumCollector } from "./CollectorBase";

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

    let result = this.getDefaultResult();
    if (result === "critical") {
      if (!this.ignoredValues.has("critical")) return "critical";
      result = "hit";
    }
    if (result === "hit") {
      if (!this.ignoredValues.has("hit")) return "hit";
      result = "miss";
    }

    return result;
  }

  get hits() {
    return this.result !== "miss";
  }
}
