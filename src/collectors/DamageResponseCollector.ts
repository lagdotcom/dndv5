import DamageResponse from "../types/DamageResponse";
import AbstractCollector from "./AbstractCollector";

const priority: DamageResponse[] = ["absorb", "immune", "resist", "vulnerable"];

export default class DamageResponseCollector extends AbstractCollector<DamageResponse> {
  getResult(values: DamageResponse[]): DamageResponse {
    for (const p of priority) {
      if (values.includes(p)) return p;
    }
    return "normal";
  }
}
