import EventData from "./EventData";

type Detail = EventData["getACMethods"];
export default class GetACMethodsEvent extends CustomEvent<Detail> {
  constructor(detail: Detail) {
    super("getACMethods", { detail });
  }
}
