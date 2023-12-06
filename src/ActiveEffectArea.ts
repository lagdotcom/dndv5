import { Listener } from "./events/Dispatcher";
import EffectArea, { AreaTag, SpecifiedEffectShape } from "./types/EffectArea";
import { resolveArea } from "./utils/areas";

export default class ActiveEffectArea implements EffectArea {
  id: number;

  constructor(
    public name: string,
    public shape: SpecifiedEffectShape,
    public tags: Set<AreaTag>,
    public tint: string,
    public handler?: Listener<"GetTerrain">,
    public points = resolveArea(shape),
  ) {
    this.id = NaN;
  }
}
