import EventData from "./EventData";

type Detail = EventData["effectRemoved"];
export default class EffectRemovedEvent extends CustomEvent<Detail> {
  constructor(detail: Detail) {
    super("effectRemoved", { detail });
  }
}
