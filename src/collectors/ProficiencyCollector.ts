import ProficiencyType from "../types/ProficiencyType";
import { AbstractSumCollector } from "./CollectorBase";

export default class ProficiencyCollector extends AbstractSumCollector<
  ProficiencyType,
  number
> {
  getSum(values: ProficiencyType[]) {
    if (values.includes("expertise")) return 2;
    if (values.includes("proficient")) return 1;
    if (values.includes("half")) return 0.5;
    return 0;
  }
}
