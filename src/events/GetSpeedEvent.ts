import EventData from "./EventData";

type Detail = EventData["getSpeed"];
export default class GetSpeedEvent extends CustomEvent<Detail> {
  constructor(detail: Detail) {
    super("getSpeed", { detail });
  }
}
