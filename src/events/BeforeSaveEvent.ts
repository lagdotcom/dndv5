import EventData from "./EventData";

type Detail = EventData["beforeSave"];
export default class BeforeSaveEvent extends CustomEvent<Detail> {
  constructor(detail: Detail) {
    super("beforeSave", { detail });
  }
}
