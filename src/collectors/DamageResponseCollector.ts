import DamageResponse from "../types/DamageResponse";
import { AbstractSumCollector } from "./CollectorBase";

export default class DamageResponseCollector extends AbstractSumCollector<DamageResponse> {
  getSum(values: DamageResponse[]): DamageResponse {
    if (values.includes("absorb")) return "absorb";
    if (values.includes("immune")) return "immune";
    if (values.includes("resist") && !values.includes("vulnerable"))
      return "resist";
    if (values.includes("vulnerable")) return "vulnerable";

    return "normal";
  }
}
