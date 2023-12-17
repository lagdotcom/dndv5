import SaveDamageResponse from "../types/SaveDamageResponse";
import { AbstractSumCollector } from "./CollectorBase";

export default class SaveDamageResponseCollector extends AbstractSumCollector<SaveDamageResponse> {
  constructor(public fallback: SaveDamageResponse) {
    super();
  }

  getSum(values: SaveDamageResponse[]): SaveDamageResponse {
    if (values.includes("zero")) return "zero";
    if (values.includes("half")) return "half";
    return this.fallback;
  }
}
