import EventData from "./EventData";

type Detail = EventData["listChoice"];
export default class ListChoiceEvent extends CustomEvent<Detail> {
  constructor(detail: Detail) {
    super("listChoice", { detail });
  }
}
