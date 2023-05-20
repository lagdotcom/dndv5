import Resource from "./types/Resource";

export class LongRestResource implements Resource {
  constructor(public name: string, public maximum: number) {}
}
