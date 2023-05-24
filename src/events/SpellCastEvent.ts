import EventData from "./EventData";

type Detail = EventData["spellCast"];
export default class SpellCastEvent extends CustomEvent<Detail> {
  constructor(detail: Detail) {
    super("spellCast", { detail });
  }
}
