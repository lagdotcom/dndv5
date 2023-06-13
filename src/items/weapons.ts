import Engine from "../Engine";
import AbilityName from "../types/AbilityName";
import DamageAmount from "../types/DamageAmount";
import {
  AmmunitionTag,
  WeaponCategory,
  WeaponItem,
  WeaponProperty,
  WeaponRangeCategory,
} from "../types/Item";
import { _dd } from "../utils/dice";
import AbstractItem from "./AbstractItem";
import lightCrossbowUrl from "./icons/light-crossbow.svg";
import longswordUrl from "./icons/longsword.svg";
import quarterstaffUrl from "./icons/quarterstaff.svg";
import spearUrl from "./icons/spear.svg";
import tridentUrl from "./icons/trident.svg";

export abstract class AbstractWeapon
  extends AbstractItem<"weapon">
  implements WeaponItem
{
  ammunitionTag?: AmmunitionTag;
  forceAbilityScore?: AbilityName;
  properties: Set<WeaponProperty>;
  quantity: number;
  weaponType: string;

  constructor(
    public g: Engine,
    name: string,
    public category: WeaponCategory,
    public rangeCategory: WeaponRangeCategory,
    public damage: DamageAmount,
    properties: Iterable<WeaponProperty> = [],
    public shortRange?: number,
    public longRange?: number
  ) {
    super(g, "weapon", name, 1);

    this.weaponType = name;
    this.properties = new Set(properties);
    this.quantity = 1;
  }
}

export class Club extends AbstractWeapon {
  constructor(g: Engine) {
    super(g, "club", "simple", "melee", _dd(1, 4, "bludgeoning"), ["light"]);
  }
}

export class Dagger extends AbstractWeapon {
  constructor(g: Engine, quantity: number) {
    super(
      g,
      "dagger",
      "simple",
      "melee",
      _dd(1, 4, "piercing"),
      ["finesse", "light", "thrown"],
      20,
      60
    );
    this.quantity = quantity;
  }
}

export class Greatclub extends AbstractWeapon {
  constructor(g: Engine) {
    super(g, "greatclub", "simple", "melee", _dd(1, 8, "bludgeoning"), [
      "two-handed",
    ]);
  }
}

export class Handaxe extends AbstractWeapon {
  constructor(g: Engine, quantity: number) {
    super(
      g,
      "handaxe",
      "simple",
      "melee",
      _dd(1, 6, "slashing"),
      ["light", "thrown"],
      20,
      60
    );
    this.quantity = quantity;
  }
}

export class Javelin extends AbstractWeapon {
  constructor(g: Engine, quantity: number) {
    super(
      g,
      "javelin",
      "simple",
      "melee",
      _dd(1, 6, "piercing"),
      ["thrown"],
      30,
      120
    );
    this.quantity = quantity;
  }
}

export class LightHammer extends AbstractWeapon {
  constructor(g: Engine, quantity: number) {
    super(
      g,
      "light hammer",
      "simple",
      "melee",
      _dd(1, 4, "bludgeoning"),
      ["light", "thrown"],
      20,
      60
    );
    this.quantity = quantity;
  }
}

export class Mace extends AbstractWeapon {
  constructor(g: Engine) {
    super(g, "mace", "simple", "melee", _dd(1, 6, "bludgeoning"));
  }
}

export class Quarterstaff extends AbstractWeapon {
  constructor(g: Engine) {
    super(g, "quarterstaff", "simple", "melee", _dd(1, 6, "bludgeoning"), [
      "versatile",
    ]);
    this.iconUrl = quarterstaffUrl;
  }
}

export class Sickle extends AbstractWeapon {
  constructor(g: Engine) {
    super(g, "sickle", "simple", "melee", _dd(1, 4, "slashing"), ["light"]);
  }
}

export class Spear extends AbstractWeapon {
  constructor(g: Engine, quantity: number) {
    super(
      g,
      "spear",
      "simple",
      "melee",
      _dd(1, 6, "piercing"),
      ["thrown", "versatile"],
      20,
      60
    );
    this.quantity = quantity;
    this.iconUrl = spearUrl;
  }
}

export class LightCrossbow extends AbstractWeapon {
  constructor(g: Engine) {
    super(
      g,
      "light crossbow",
      "simple",
      "ranged",
      _dd(1, 8, "piercing"),
      ["ammunition", "loading", "two-handed"],
      80,
      320
    );
    this.ammunitionTag = "crossbow";
    this.iconUrl = lightCrossbowUrl;
  }
}

export class Dart extends AbstractWeapon {
  constructor(g: Engine, quantity: number) {
    super(
      g,
      "dart",
      "simple",
      "ranged",
      _dd(1, 4, "piercing"),
      ["finesse", "thrown"],
      20,
      60
    );
    this.quantity = quantity;
  }
}

export class Shortbow extends AbstractWeapon {
  constructor(g: Engine) {
    super(
      g,
      "shortbow",
      "simple",
      "ranged",
      _dd(1, 6, "piercing"),
      ["ammunition", "two-handed"],
      80,
      320
    );
    this.ammunitionTag = "bow";
  }
}

export class Sling extends AbstractWeapon {
  constructor(g: Engine) {
    super(
      g,
      "sling",
      "simple",
      "ranged",
      _dd(1, 4, "bludgeoning"),
      ["ammunition"],
      30,
      120
    );
    this.ammunitionTag = "sling";
  }
}

export class Battleaxe extends AbstractWeapon {
  constructor(g: Engine) {
    super(g, "battleaxe", "martial", "melee", _dd(1, 8, "slashing"), [
      "versatile",
    ]);
  }
}

export class Flail extends AbstractWeapon {
  constructor(g: Engine) {
    super(g, "flail", "martial", "melee", _dd(1, 8, "bludgeoning"));
  }
}

export class Glaive extends AbstractWeapon {
  constructor(g: Engine) {
    super(g, "glaive", "martial", "melee", _dd(1, 10, "slashing"), [
      "heavy",
      "reach",
      "two-handed",
    ]);
  }
}

export class Greataxe extends AbstractWeapon {
  constructor(g: Engine) {
    super(g, "greataxe", "martial", "melee", _dd(1, 12, "slashing"), [
      "heavy",
      "two-handed",
    ]);
  }
}

export class Greatsword extends AbstractWeapon {
  constructor(g: Engine) {
    super(g, "greatsword", "martial", "melee", _dd(2, 6, "slashing"), [
      "heavy",
      "two-handed",
    ]);
  }
}

export class Halberd extends AbstractWeapon {
  constructor(g: Engine) {
    super(g, "halberd", "martial", "melee", _dd(1, 10, "slashing"), [
      "heavy",
      "reach",
      "two-handed",
    ]);
  }
}

export class Lance extends AbstractWeapon {
  constructor(g: Engine) {
    super(g, "lance", "martial", "melee", _dd(1, 12, "piercing"), ["reach"]);
    // TODO [HANDS] You have disadvantage when you use a lance to attack a target within 5 feet of you. Also, a lance requires two hands to wield when you aren't mounted.
  }
}

export class Longsword extends AbstractWeapon {
  constructor(g: Engine) {
    super(g, "longsword", "martial", "melee", _dd(1, 8, "slashing"), [
      "versatile",
    ]);
    this.iconUrl = longswordUrl;
  }
}

export class Maul extends AbstractWeapon {
  constructor(g: Engine) {
    super(g, "maul", "martial", "melee", _dd(2, 6, "bludgeoning"), [
      "heavy",
      "two-handed",
    ]);
  }
}

export class Morningstar extends AbstractWeapon {
  constructor(g: Engine) {
    super(g, "morningstar", "martial", "melee", _dd(1, 8, "piercing"));
  }
}

export class Pike extends AbstractWeapon {
  constructor(g: Engine) {
    super(g, "pike", "martial", "melee", _dd(1, 10, "piercing"), [
      "heavy",
      "reach",
      "two-handed",
    ]);
  }
}

export class Rapier extends AbstractWeapon {
  constructor(g: Engine) {
    super(g, "rapier", "martial", "melee", _dd(1, 8, "piercing"), ["finesse"]);
  }
}

export class Scimitar extends AbstractWeapon {
  constructor(g: Engine) {
    super(g, "scimitar", "martial", "melee", _dd(1, 6, "slashing"), [
      "finesse",
      "light",
    ]);
  }
}

export class Shortsword extends AbstractWeapon {
  constructor(g: Engine) {
    super(g, "shortsword", "martial", "melee", _dd(1, 6, "piercing"), [
      "finesse",
      "light",
    ]);
  }
}

export class Trident extends AbstractWeapon {
  constructor(g: Engine, quantity: number) {
    super(
      g,
      "trident",
      "martial",
      "melee",
      _dd(1, 6, "piercing"),
      ["thrown", "versatile"],
      20,
      60
    );
    this.quantity = quantity;
    this.iconUrl = tridentUrl;
  }
}

export class WarPick extends AbstractWeapon {
  constructor(g: Engine) {
    super(g, "war pick", "martial", "melee", _dd(1, 8, "piercing"));
  }
}

export class Warhammer extends AbstractWeapon {
  constructor(g: Engine) {
    super(g, "warhammer", "martial", "melee", _dd(1, 8, "bludgeoning"), [
      "versatile",
    ]);
  }
}

export class Whip extends AbstractWeapon {
  constructor(g: Engine) {
    super(g, "whip", "martial", "melee", _dd(1, 4, "slashing"), [
      "finesse",
      "reach",
    ]);
  }
}

export class Blowgun extends AbstractWeapon {
  constructor(g: Engine) {
    super(
      g,
      "blowgun",
      "martial",
      "ranged",
      { type: "flat", amount: 1, damageType: "piercing" },
      ["ammunition", "loading"],
      25,
      100
    );
    this.ammunitionTag = "blowgun";
  }
}

export class HandCrossbow extends AbstractWeapon {
  constructor(g: Engine) {
    super(
      g,
      "hand crossbow",
      "martial",
      "ranged",
      _dd(1, 6, "piercing"),
      ["ammunition", "light", "loading"],
      30,
      120
    );
    this.ammunitionTag = "crossbow";
  }
}

export class HeavyCrossbow extends AbstractWeapon {
  constructor(g: Engine) {
    super(
      g,
      "heavy crossbow",
      "martial",
      "ranged",
      _dd(1, 10, "piercing"),
      ["ammunition", "heavy", "loading", "two-handed"],
      100,
      400
    );
    this.ammunitionTag = "crossbow";
  }
}

export class Longbow extends AbstractWeapon {
  constructor(g: Engine) {
    super(
      g,
      "longbow",
      "martial",
      "ranged",
      _dd(1, 8, "piercing"),
      ["ammunition", "heavy", "two-handed"],
      150,
      600
    );
    this.ammunitionTag = "bow";
  }
}

export class Net extends AbstractWeapon {
  constructor(g: Engine, quantity: number) {
    super(
      g,
      "net",
      "martial",
      "ranged",
      { type: "flat", amount: 0, damageType: "bludgeoning" },
      ["thrown"],
      5,
      15
    );
    this.quantity = quantity;

    // TODO A Large or smaller creature hit by a net is restrained until it is freed. A net has no effect on creatures that are formless, or creatures that are Huge or larger. A creature can use its action to make a DC 10 Strength check, freeing itself or another creature within its reach on a success. Dealing 5 slashing damage to the net (AC 10) also frees the creature without harming it, ending the effect and destroying the net. When you use an action, bonus action, or reaction to attack with a net, you can make only one attack regardless of the number of attacks you can normally make.
  }
}
