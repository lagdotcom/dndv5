import Engine from "../Engine";
import { ArmorCategory, ArmorItem } from "../types/Item";

export abstract class AbstractArmor implements ArmorItem {
  itemType: "armor";
  hands: number;

  constructor(
    public name: string,
    public category: ArmorCategory,
    public ac: number,
    public stealthDisadvantage = false,
    public minimumStrength = 0
  ) {
    this.itemType = "armor";
    this.hands = 0;
  }
}

export class PaddedArmor extends AbstractArmor {
  constructor(public g: Engine) {
    super("padded armor", "light", 11, true);
  }
}

export class LeatherArmor extends AbstractArmor {
  constructor(public g: Engine) {
    super("leather armor", "light", 11);
  }
}

export class StuddedLeatherArmor extends AbstractArmor {
  constructor(public g: Engine) {
    super("studded leather armor", "light", 12);
  }
}

export class HideArmor extends AbstractArmor {
  constructor(public g: Engine) {
    super("hide armor", "medium", 12);
  }
}

export class ChainShirtArmor extends AbstractArmor {
  constructor(public g: Engine) {
    super("chain shirt armor", "medium", 13);
  }
}

export class ScaleMailArmor extends AbstractArmor {
  constructor(public g: Engine) {
    super("scale mail armor", "medium", 14, true);
  }
}

export class BreastplateArmor extends AbstractArmor {
  constructor(public g: Engine) {
    super("breastplate armor", "medium", 14);
  }
}

export class HalfPlateArmor extends AbstractArmor {
  constructor(public g: Engine) {
    super("half plate armor", "medium", 15, true);
  }
}

export class RingMailArmor extends AbstractArmor {
  constructor(public g: Engine) {
    super("ring mail armor", "heavy", 14, true);
  }
}

export class ChainMailArmor extends AbstractArmor {
  constructor(public g: Engine) {
    super("chain mail armor", "heavy", 16, true, 13);
  }
}

export class SplintArmor extends AbstractArmor {
  constructor(public g: Engine) {
    super("splint armor", "heavy", 17, true, 15);
  }
}

export class PlateArmor extends AbstractArmor {
  constructor(public g: Engine) {
    super("plate armor", "heavy", 18, true, 15);
  }
}

export class Shield extends AbstractArmor {
  constructor(public g: Engine) {
    super("shield", "shield", 2);
    this.hands = 1;
  }
}
