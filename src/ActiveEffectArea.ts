import { Listener } from "./events/Dispatcher";
import PointSet from "./PointSet";
import EffectArea, { AreaTag, SpecifiedEffectShape } from "./types/EffectArea";
import { resolveArea } from "./utils/areas";

export type ActiveEffectAreaHandler = Listener<"GetTerrain">;

export default class ActiveEffectArea implements EffectArea {
  id: number;
  points: PointSet;

  constructor(
    public name: string,
    public shape: SpecifiedEffectShape,
    public tags: Set<AreaTag>,
    public tint: string,
    public handler?: ActiveEffectAreaHandler,
  ) {
    this.id = NaN;
    this.points = resolveArea(shape);
  }
}
