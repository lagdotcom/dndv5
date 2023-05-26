import EventData from "./EventData";

type Detail = EventData["getInitiative"];
export default class GetInitiativeEvent extends CustomEvent<Detail> {
  constructor(detail: Detail) {
    super("getInitiative", { detail });
  }
}
