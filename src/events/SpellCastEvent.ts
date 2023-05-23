import EventBase from "./EventBase";
import EventData from "./EventData";

export default class SpellCastEvent extends EventBase<"spellCast"> {
  constructor(detail: EventData["spellCast"]) {
    super("spellCast", detail);
  }
}
