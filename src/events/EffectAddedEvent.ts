import EventData from "./EventData";

type Detail = EventData["effectAdded"];
export default class EffectAddedEvent extends CustomEvent<Detail> {
  constructor(detail: Detail) {
    super("effectAdded", { detail });
  }
}
