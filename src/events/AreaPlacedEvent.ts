import EffectArea from "../types/EffectArea";

export interface AreaPlacedDetail {
  area: EffectArea;
}

export default class AreaPlacedEvent extends CustomEvent<AreaPlacedDetail> {
  constructor(detail: AreaPlacedDetail) {
    super("AreaPlaced", { detail });
  }
}
