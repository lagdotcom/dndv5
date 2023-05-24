import EventData from "./EventData";

type Detail = EventData["getConditions"];
export default class GetConditionsEvent extends CustomEvent<Detail> {
  constructor(detail: Detail) {
    super("getConditions", { detail });
  }
}
