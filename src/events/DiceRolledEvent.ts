import EventBase from "./EventBase";
import EventData from "./EventData";

export default class DiceRolledEvent extends EventBase<"diceRolled"> {
  constructor(detail: EventData["diceRolled"]) {
    super("diceRolled", detail);
  }
}
