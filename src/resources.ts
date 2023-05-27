import Resource from "./types/Resource";

export const ResourceRegistry = new Map<string, Resource>();

export class LongRestResource implements Resource {
  refresh: "longRest";
  constructor(public name: string, public maximum: number) {
    ResourceRegistry.set(name, this);
    this.refresh = "longRest";
  }
}

export class TurnResource implements Resource {
  refresh: "turnStart";
  constructor(public name: string, public maximum: number) {
    ResourceRegistry.set(name, this);
    this.refresh = "turnStart";
  }
}
