import SuccessType from "../types/SuccessType";
import { AbstractSumCollector } from "./AbstractCollector";

export default class SuccessResponseCollector extends AbstractSumCollector<SuccessType> {
  getSum(values: SuccessType[]): SuccessType {
    if (values.includes("succeed")) return "succeed";
    if (values.includes("fail")) return "fail";

    return "normal";
  }
}
