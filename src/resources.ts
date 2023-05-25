import Resource from "./types/Resource";

export class LongRestResource implements Resource {
  refresh: "longRest";
  constructor(public name: string, public maximum: number) {
    this.refresh = "longRest";
  }
}

export class TurnResource implements Resource {
  refresh: "turnStart";
  constructor(public name: string, public maximum: number) {
    this.refresh = "turnStart";
  }
}
