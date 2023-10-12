import arrowUrl from "@img/eq/arrow.svg";
import boltUrl from "@img/eq/bolt.svg";

import Engine from "../Engine";
import { AmmoItem, AmmunitionTag } from "../types/Item";
import AbstractItem from "./AbstractItem";

export class AbstractAmmo extends AbstractItem<"ammo"> implements AmmoItem {
  constructor(
    g: Engine,
    name: string,
    public ammunitionTag: AmmunitionTag,
    public quantity: number,
    iconUrl?: string,
  ) {
    super(g, "ammo", name, 0, iconUrl);
  }
}

export class Arrow extends AbstractAmmo {
  constructor(g: Engine, quantity: number) {
    super(g, "arrow", "bow", quantity, arrowUrl);
  }
}

export class BlowgunNeedle extends AbstractAmmo {
  constructor(g: Engine, quantity: number) {
    super(g, "blowgun needle", "blowgun", quantity);
  }
}

export class CrossbowBolt extends AbstractAmmo {
  constructor(g: Engine, quantity: number) {
    super(g, "crossbow bolt", "crossbow", quantity, boltUrl);
  }
}

export class SlingBullet extends AbstractAmmo {
  constructor(g: Engine, quantity: number) {
    super(g, "sling bullet", "sling", quantity);
  }
}
