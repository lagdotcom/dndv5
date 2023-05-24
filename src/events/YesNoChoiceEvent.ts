import EventData from "./EventData";

type Detail = EventData["yesNoChoice"];
export default class YesNoChoiceEvent extends CustomEvent<Detail> {
  constructor(detail: Detail) {
    super("yesNoChoice", { detail });
  }
}
