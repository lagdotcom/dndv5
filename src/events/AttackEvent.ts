import EventData from "./EventData";

type Detail = EventData["attack"];
export default class AttackEvent extends CustomEvent<Detail> {
  constructor(detail: Detail) {
    super("attack", { detail });
  }
}
