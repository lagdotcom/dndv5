import ErrorCollector from "../collectors/ErrorCollector";
import Combatant from "../types/Combatant";

export interface CheckHearingDetail {
  who: Combatant;
  target: Combatant;
  error: ErrorCollector;
}

export default class CheckHearingEvent extends CustomEvent<CheckHearingDetail> {
  constructor(detail: CheckHearingDetail) {
    super("CheckHearing", { detail });
  }
}
