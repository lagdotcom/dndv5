import Engine from "../Engine";
import ArmorBase from "./ArmorBase";

export class PaddedArmor extends ArmorBase {
  constructor(g: Engine) {
    super(g, "padded armor", "light", 11, false, true);
  }
}

export class LeatherArmor extends ArmorBase {
  constructor(g: Engine) {
    super(g, "leather armor", "light", 11, false);
  }
}

export class StuddedLeatherArmor extends ArmorBase {
  constructor(g: Engine) {
    super(g, "studded leather armor", "light", 12, false);
  }
}

export class HideArmor extends ArmorBase {
  constructor(g: Engine) {
    super(g, "hide armor", "medium", 12, false);
  }
}

export class ChainShirtArmor extends ArmorBase {
  constructor(g: Engine) {
    super(g, "chain shirt armor", "medium", 13, true);
  }
}

export class ScaleMailArmor extends ArmorBase {
  constructor(g: Engine) {
    super(g, "scale mail armor", "medium", 14, true, true);
  }
}

export class BreastplateArmor extends ArmorBase {
  constructor(g: Engine) {
    super(g, "breastplate armor", "medium", 14, true);
  }
}

export class HalfPlateArmor extends ArmorBase {
  constructor(g: Engine) {
    super(g, "half plate armor", "medium", 15, true, true);
  }
}

export class RingMailArmor extends ArmorBase {
  constructor(g: Engine) {
    super(g, "ring mail armor", "heavy", 14, true, true);
  }
}

export class ChainMailArmor extends ArmorBase {
  constructor(g: Engine) {
    super(g, "chain mail armor", "heavy", 16, true, true, 13);
  }
}

export class SplintArmor extends ArmorBase {
  constructor(g: Engine) {
    super(g, "splint armor", "heavy", 17, true, true, 15);
  }
}

export class PlateArmor extends ArmorBase {
  constructor(g: Engine) {
    super(g, "plate armor", "heavy", 18, true, true, 15);
  }
}

export class Shield extends ArmorBase {
  constructor(g: Engine, iconUrl?: string) {
    super(g, "shield", "shield", 2, true, false, undefined, iconUrl);
    this.hands = 1;
  }
}
