import SuccessType from "../types/SuccessType";
import { AbstractSumCollector } from "./CollectorBase";

export default class SuccessResponseCollector extends AbstractSumCollector<SuccessType> {
  getSum(values: SuccessType[]): SuccessType {
    if (values.includes("success")) return "success";
    if (values.includes("fail")) return "fail";

    return "normal";
  }
}
