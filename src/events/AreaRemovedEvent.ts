import EventData from "./EventData";

type Detail = EventData["areaRemoved"];
export default class AreaRemovedEvent extends CustomEvent<Detail> {
  constructor(detail: Detail) {
    super("areaRemoved", { detail });
  }
}
