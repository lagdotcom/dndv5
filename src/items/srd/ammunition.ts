import arrowUrl from "@img/eq/arrow.svg";
import boltUrl from "@img/eq/bolt.svg";

import Engine from "../../Engine";
import AbstractAmmo from "../AbstractAmmo";

export class Arrow extends AbstractAmmo {
  constructor(g: Engine) {
    super(g, "arrow", "bow", arrowUrl);
  }
}

export class BlowgunNeedle extends AbstractAmmo {
  constructor(g: Engine) {
    super(g, "blowgun needle", "blowgun");
  }
}

export class CrossbowBolt extends AbstractAmmo {
  constructor(g: Engine) {
    super(g, "crossbow bolt", "crossbow", boltUrl);
  }
}

export class SlingBullet extends AbstractAmmo {
  constructor(g: Engine) {
    super(g, "sling bullet", "sling");
  }
}
