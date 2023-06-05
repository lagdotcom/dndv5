import EffectArea from "../types/EffectArea";

export interface AreaRemovedDetail {
  area: EffectArea;
}

export default class AreaRemovedEvent extends CustomEvent<AreaRemovedDetail> {
  constructor(detail: AreaRemovedDetail) {
    super("AreaRemoved", { detail });
  }
}
