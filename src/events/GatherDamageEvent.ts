import EventData from "./EventData";

type Detail = EventData["gatherDamage"];
export default class GatherDamageEvent extends CustomEvent<Detail> {
  constructor(detail: Detail) {
    super("gatherDamage", { detail });
  }
}
