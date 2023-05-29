import EffectArea, { AreaTag } from "../types/EffectArea";
import { SpecifiedEffectShape } from "../types/EffectArea";
import Point from "../types/Point";

export default class SphereEffectArea implements EffectArea {
  id: number;
  shape: SpecifiedEffectShape;
  tags: Set<AreaTag>;

  constructor(
    public name: string,
    public centre: Point,
    public radius: number,
    tags: AreaTag[] = []
  ) {
    this.id = NaN;
    this.tags = new Set(tags);
    this.shape = { type: "sphere", centre, radius };
  }
}
