import EventData from "./EventData";

type Detail = EventData["turnStarted"];
export default class TurnStartedEvent extends CustomEvent<Detail> {
  constructor(detail: Detail) {
    super("turnStarted", { detail });
  }
}
