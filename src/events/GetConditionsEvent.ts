import ConditionCollector from "../collectors/ConditionCollector";
import Combatant from "../types/Combatant";

export interface GetConditionsDetail {
  who: Combatant;
  conditions: ConditionCollector;
}

export default class GetConditionsEvent extends CustomEvent<GetConditionsDetail> {
  constructor(detail: GetConditionsDetail) {
    super("GetConditions", { detail });
  }
}
