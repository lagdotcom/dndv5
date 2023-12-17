import arrowUrl from "@img/eq/arrow.svg";
import boltUrl from "@img/eq/bolt.svg";

import Engine from "../Engine";
import AmmoBase from "./AmmoBase";

export class Arrow extends AmmoBase {
  constructor(g: Engine) {
    super(g, "arrow", "bow", arrowUrl);
  }
}

export class BlowgunNeedle extends AmmoBase {
  constructor(g: Engine) {
    super(g, "blowgun needle", "blowgun");
  }
}

export class CrossbowBolt extends AmmoBase {
  constructor(g: Engine) {
    super(g, "crossbow bolt", "crossbow", boltUrl);
  }
}

export class SlingBullet extends AmmoBase {
  constructor(g: Engine) {
    super(g, "sling bullet", "sling");
  }
}
