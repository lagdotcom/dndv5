import EventBase from "./EventBase";
import EventData from "./EventData";

export default class BeforeAttackEvent extends EventBase<"beforeAttack"> {
  constructor(detail: EventData["beforeAttack"]) {
    super("beforeAttack", detail);
  }
}
