import Engine from "../Engine";
import { AmmoItem, AmmunitionTag } from "../types/Item";

export class AbstractAmmo implements AmmoItem {
  itemType: "ammo";
  hands: number;

  constructor(
    public name: string,
    public ammunitionTag: AmmunitionTag,
    public quantity: number
  ) {
    this.itemType = "ammo";
    this.hands = 0;
  }
}

export class Arrow extends AbstractAmmo {
  constructor(public g: Engine, quantity: number) {
    super("arrow", "bow", quantity);
  }
}

export class BlowgunNeedle extends AbstractAmmo {
  constructor(public g: Engine, quantity: number) {
    super("blowgun needle", "blowgun", quantity);
  }
}

export class CrossbowBolt extends AbstractAmmo {
  constructor(public g: Engine, quantity: number) {
    super("crossbow bolt", "crossbow", quantity);
  }
}

export class SlingBullet extends AbstractAmmo {
  constructor(public g: Engine, quantity: number) {
    super("sling bullet", "sling", quantity);
  }
}
