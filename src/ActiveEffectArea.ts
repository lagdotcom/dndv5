import EffectArea, { AreaTag, SpecifiedEffectShape } from "./types/EffectArea";

export default class ActiveEffectArea implements EffectArea {
  id: number;

  constructor(
    public name: string,
    public shape: SpecifiedEffectShape,
    public tags: Set<AreaTag>,
    public tint: string,
  ) {
    this.id = NaN;
  }
}
