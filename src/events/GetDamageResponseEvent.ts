import EventData from "./EventData";

type Detail = EventData["getDamageResponse"];
export default class GetDamageResponseEvent extends CustomEvent<Detail> {
  constructor(detail: Detail) {
    super("getDamageResponse", { detail });
  }
}
