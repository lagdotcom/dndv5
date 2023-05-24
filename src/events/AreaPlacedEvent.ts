import EventData from "./EventData";

type Detail = EventData["areaPlaced"];
export default class AreaPlacedEvent extends CustomEvent<Detail> {
  constructor(detail: Detail) {
    super("areaPlaced", { detail });
  }
}
