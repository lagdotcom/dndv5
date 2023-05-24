import EventData from "./EventData";

type Detail = EventData["beforeAttack"];
export default class BeforeAttackEvent extends CustomEvent<Detail> {
  constructor(detail: Detail) {
    super("beforeAttack", { detail });
  }
}
