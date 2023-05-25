import EventData from "./EventData";

type Detail = EventData["turnEnded"];
export default class TurnEndedEvent extends CustomEvent<Detail> {
  constructor(detail: Detail) {
    super("turnEnded", { detail });
  }
}
