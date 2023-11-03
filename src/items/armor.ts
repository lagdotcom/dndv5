import Engine from "../Engine";
import { ArmorCategory, ArmorItem } from "../types/Item";
import AbstractItem from "./AbstractItem";

export abstract class AbstractArmor
  extends AbstractItem<"armor">
  implements ArmorItem
{
  constructor(
    g: Engine,
    name: string,
    public category: ArmorCategory,
    public ac: number,
    public stealthDisadvantage = false,
    public minimumStrength = 0,
    iconUrl?: string,
  ) {
    super(g, "armor", name, 0, iconUrl);
  }
}

export class PaddedArmor extends AbstractArmor {
  constructor(g: Engine) {
    super(g, "padded armor", "light", 11, true);
  }
}

export class LeatherArmor extends AbstractArmor {
  constructor(g: Engine) {
    super(g, "leather armor", "light", 11);
  }
}

export class StuddedLeatherArmor extends AbstractArmor {
  constructor(g: Engine) {
    super(g, "studded leather armor", "light", 12);
  }
}

export class HideArmor extends AbstractArmor {
  constructor(g: Engine) {
    super(g, "hide armor", "medium", 12);
  }
}

export class ChainShirtArmor extends AbstractArmor {
  constructor(g: Engine) {
    super(g, "chain shirt armor", "medium", 13);
  }
}

export class ScaleMailArmor extends AbstractArmor {
  constructor(g: Engine) {
    super(g, "scale mail armor", "medium", 14, true);
  }
}

export class BreastplateArmor extends AbstractArmor {
  constructor(g: Engine) {
    super(g, "breastplate armor", "medium", 14);
  }
}

export class HalfPlateArmor extends AbstractArmor {
  constructor(g: Engine) {
    super(g, "half plate armor", "medium", 15, true);
  }
}

export class RingMailArmor extends AbstractArmor {
  constructor(g: Engine) {
    super(g, "ring mail armor", "heavy", 14, true);
  }
}

export class ChainMailArmor extends AbstractArmor {
  constructor(g: Engine) {
    super(g, "chain mail armor", "heavy", 16, true, 13);
  }
}

export class SplintArmor extends AbstractArmor {
  constructor(g: Engine) {
    super(g, "splint armor", "heavy", 17, true, 15);
  }
}

export class PlateArmor extends AbstractArmor {
  constructor(g: Engine) {
    super(g, "plate armor", "heavy", 18, true, 15);
  }
}

export class Shield extends AbstractArmor {
  constructor(g: Engine, iconUrl?: string) {
    super(g, "shield", "shield", 2, false, undefined, iconUrl);
    this.hands = 1;
  }
}
