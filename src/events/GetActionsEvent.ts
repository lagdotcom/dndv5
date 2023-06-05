import Action from "../types/Action";
import Combatant from "../types/Combatant";

export interface GetActionsDetail {
  who: Combatant;
  target?: Combatant;
  actions: Action[]; // TODO collector?
}

export default class GetActionsEvent extends CustomEvent<GetActionsDetail> {
  constructor(detail: GetActionsDetail) {
    super("GetActions", { detail });
  }
}
