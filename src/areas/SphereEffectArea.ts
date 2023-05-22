import EffectArea, { AreaTag } from "../types/EffectArea";
import Point from "../types/Point";

export default class SphereEffectArea implements EffectArea {
  id: number;
  tags: Set<AreaTag>;
  type: "sphere";

  constructor(
    public name: string,
    public centre: Point,
    public radius: number,
    tags: AreaTag[] = []
  ) {
    this.id = NaN;
    this.tags = new Set(tags);
    this.type = "sphere";
  }
}
