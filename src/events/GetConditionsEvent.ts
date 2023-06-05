import Combatant from "../types/Combatant";
import ConditionName from "../types/ConditionName";

export interface GetConditionsDetail {
  who: Combatant;
  conditions: Set<ConditionName>; // TODO collector?
}

export default class GetConditionsEvent extends CustomEvent<GetConditionsDetail> {
  constructor(detail: GetConditionsDetail) {
    super("GetConditions", { detail });
  }
}
