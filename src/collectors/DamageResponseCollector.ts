import DamageResponse, { DamageResponses } from "../types/DamageResponse";
import { AbstractSumCollector } from "./AbstractCollector";

export default class DamageResponseCollector extends AbstractSumCollector<DamageResponse> {
  getSum(values: DamageResponse[]): DamageResponse {
    for (const p of DamageResponses) {
      if (values.includes(p)) return p;
    }
    return "normal";
  }
}
