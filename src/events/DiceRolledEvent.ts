import EventData from "./EventData";

type Detail = EventData["diceRolled"];
export default class DiceRolledEvent extends CustomEvent<Detail> {
  constructor(detail: Detail) {
    super("diceRolled", { detail });
  }
}
