import Engine from "../Engine";
import { AmmoItem, AmmunitionTag } from "../types/Item";
import AbstractItem from "./AbstractItem";
import boltUrl from "./icons/bolt.svg";

export class AbstractAmmo extends AbstractItem<"ammo"> implements AmmoItem {
  constructor(
    g: Engine,
    name: string,
    public ammunitionTag: AmmunitionTag,
    public quantity: number
  ) {
    super(g, "ammo", name);
  }
}

export class Arrow extends AbstractAmmo {
  constructor(g: Engine, quantity: number) {
    super(g, "arrow", "bow", quantity);
  }
}

export class BlowgunNeedle extends AbstractAmmo {
  constructor(g: Engine, quantity: number) {
    super(g, "blowgun needle", "blowgun", quantity);
  }
}

export class CrossbowBolt extends AbstractAmmo {
  constructor(g: Engine, quantity: number) {
    super(g, "crossbow bolt", "crossbow", quantity);
    this.iconUrl = boltUrl;
  }
}

export class SlingBullet extends AbstractAmmo {
  constructor(g: Engine, quantity: number) {
    super(g, "sling bullet", "sling", quantity);
  }
}
