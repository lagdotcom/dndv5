import EventData from "./EventData";

type Detail = EventData["getActions"];
export default class GetActionsEvent extends CustomEvent<Detail> {
  constructor(detail: Detail) {
    super("getActions", { detail });
  }
}
