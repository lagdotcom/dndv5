import DamageResponse from "../types/DamageResponse";
import { AbstractSumCollector } from "./AbstractCollector";

const priority: DamageResponse[] = ["absorb", "immune", "resist", "vulnerable"];

export default class DamageResponseCollector extends AbstractSumCollector<DamageResponse> {
  getSum(values: DamageResponse[]): DamageResponse {
    for (const p of priority) {
      if (values.includes(p)) return p;
    }
    return "normal";
  }
}
