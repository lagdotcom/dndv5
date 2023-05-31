import Effect from "./types/Effect";

export default class BaseEffect implements Effect {
  constructor(
    public name: string,
    public durationTimer: Effect["durationTimer"],
    public quiet = false
  ) {}
}
