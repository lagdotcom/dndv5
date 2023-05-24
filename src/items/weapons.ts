import Engine from "../Engine";
import Ability from "../types/Ability";
import DamageAmount from "../types/DamageAmount";
import {
  AmmunitionTag,
  WeaponCategory,
  WeaponItem,
  WeaponProperty,
  WeaponRangeCategory,
} from "../types/Item";
import { dd } from "../utils/dice";

export abstract class AbstractWeapon implements WeaponItem {
  ammunitionTag?: AmmunitionTag;
  forceAbilityScore?: Ability;
  hands: number;
  itemType: "weapon";
  properties: Set<WeaponProperty>;
  quantity: number;
  weaponType: string;

  constructor(
    public name: string,
    public category: WeaponCategory,
    public rangeCategory: WeaponRangeCategory,
    public damage: DamageAmount,
    properties: WeaponProperty[] = [],
    public shortRange?: number,
    public longRange?: number
  ) {
    this.hands = 1; // this is a MINIMUM to wield, not to fire
    this.itemType = "weapon";
    this.weaponType = name;
    this.properties = new Set(properties);
    this.quantity = 1;
  }
}

export class Club extends AbstractWeapon {
  constructor(public g: Engine) {
    super("club", "simple", "melee", dd(1, 4, "bludgeoning"), ["light"]);
  }
}

export class Dagger extends AbstractWeapon {
  constructor(public g: Engine, quantity: number) {
    super(
      "dagger",
      "simple",
      "melee",
      dd(1, 4, "piercing"),
      ["finesse", "light", "thrown"],
      20,
      60
    );
    this.quantity = quantity;
  }
}

export class Greatclub extends AbstractWeapon {
  constructor(public g: Engine) {
    super("greatclub", "simple", "melee", dd(1, 8, "bludgeoning"), [
      "two-handed",
    ]);
  }
}

export class Handaxe extends AbstractWeapon {
  constructor(public g: Engine, quantity: number) {
    super(
      "handaxe",
      "simple",
      "melee",
      dd(1, 6, "slashing"),
      ["light", "thrown"],
      20,
      60
    );
    this.quantity = quantity;
  }
}

export class Javelin extends AbstractWeapon {
  constructor(public g: Engine, quantity: number) {
    super(
      "javelin",
      "simple",
      "melee",
      dd(1, 6, "piercing"),
      ["thrown"],
      30,
      120
    );
    this.quantity = quantity;
  }
}

export class LightHammer extends AbstractWeapon {
  constructor(public g: Engine, quantity: number) {
    super(
      "light hammer",
      "simple",
      "melee",
      dd(1, 4, "bludgeoning"),
      ["light", "thrown"],
      20,
      60
    );
    this.quantity = quantity;
  }
}

export class Mace extends AbstractWeapon {
  constructor(public g: Engine) {
    super("mace", "simple", "melee", dd(1, 6, "bludgeoning"));
  }
}

export class Quarterstaff extends AbstractWeapon {
  constructor(public g: Engine) {
    super("quarterstaff", "simple", "melee", dd(1, 6, "bludgeoning"), [
      "versatile",
    ]);
  }
}

export class Sickle extends AbstractWeapon {
  constructor(public g: Engine) {
    super("sickle", "simple", "melee", dd(1, 4, "slashing"), ["light"]);
  }
}

export class Spear extends AbstractWeapon {
  constructor(public g: Engine, quantity: number) {
    super(
      "spear",
      "simple",
      "melee",
      dd(1, 6, "piercing"),
      ["thrown", "versatile"],
      20,
      60
    );
    this.quantity = quantity;
  }
}

export class LightCrossbow extends AbstractWeapon {
  constructor(public g: Engine) {
    super(
      "light crossbow",
      "simple",
      "ranged",
      dd(1, 8, "piercing"),
      ["ammunition", "loading", "two-handed"],
      80,
      320
    );
    this.ammunitionTag = "crossbow";
  }
}

export class Dart extends AbstractWeapon {
  constructor(public g: Engine, quantity: number) {
    super(
      "dart",
      "simple",
      "ranged",
      dd(1, 4, "piercing"),
      ["finesse", "thrown"],
      20,
      60
    );
    this.quantity = quantity;
  }
}

export class Shortbow extends AbstractWeapon {
  constructor(public g: Engine) {
    super(
      "shortbow",
      "simple",
      "ranged",
      dd(1, 6, "piercing"),
      ["ammunition", "two-handed"],
      80,
      320
    );
    this.ammunitionTag = "bow";
  }
}

export class Sling extends AbstractWeapon {
  constructor(public g: Engine) {
    super(
      "sling",
      "simple",
      "ranged",
      dd(1, 4, "bludgeoning"),
      ["ammunition"],
      30,
      120
    );
    this.ammunitionTag = "sling";
  }
}

export class Battleaxe extends AbstractWeapon {
  constructor(public g: Engine) {
    super("battleaxe", "martial", "melee", dd(1, 8, "slashing"), ["versatile"]);
  }
}

export class Flail extends AbstractWeapon {
  constructor(public g: Engine) {
    super("flail", "martial", "melee", dd(1, 8, "bludgeoning"));
  }
}

export class Glaive extends AbstractWeapon {
  constructor(public g: Engine) {
    super("glaive", "martial", "melee", dd(1, 10, "slashing"), [
      "heavy",
      "reach",
      "two-handed",
    ]);
  }
}

export class Greataxe extends AbstractWeapon {
  constructor(public g: Engine) {
    super("greataxe", "martial", "melee", dd(1, 12, "slashing"), [
      "heavy",
      "two-handed",
    ]);
  }
}

export class Greatsword extends AbstractWeapon {
  constructor(public g: Engine) {
    super("greatsword", "martial", "melee", dd(2, 6, "slashing"), [
      "heavy",
      "two-handed",
    ]);
  }
}

export class Halberd extends AbstractWeapon {
  constructor(public g: Engine) {
    super("halberd", "martial", "melee", dd(1, 10, "slashing"), [
      "heavy",
      "reach",
      "two-handed",
    ]);
  }
}

export class Lance extends AbstractWeapon {
  constructor(public g: Engine) {
    super("lance", "martial", "melee", dd(1, 12, "piercing"), ["reach"]);
    // TODO You have disadvantage when you use a lance to attack a target within 5 feet of you. Also, a lance requires two hands to wield when you aren't mounted.
  }
}

export class Longsword extends AbstractWeapon {
  constructor(public g: Engine) {
    super("longsword", "martial", "melee", dd(1, 8, "slashing"), ["versatile"]);
  }
}

export class Maul extends AbstractWeapon {
  constructor(public g: Engine) {
    super("maul", "martial", "melee", dd(2, 6, "bludgeoning"), [
      "heavy",
      "two-handed",
    ]);
  }
}

export class Morningstar extends AbstractWeapon {
  constructor(public g: Engine) {
    super("morningstar", "martial", "melee", dd(1, 8, "piercing"));
  }
}

export class Pike extends AbstractWeapon {
  constructor(public g: Engine) {
    super("pike", "martial", "melee", dd(1, 10, "piercing"), [
      "heavy",
      "reach",
      "two-handed",
    ]);
  }
}

export class Rapier extends AbstractWeapon {
  constructor(public g: Engine) {
    super("rapier", "martial", "melee", dd(1, 8, "piercing"), ["finesse"]);
  }
}

export class Scimitar extends AbstractWeapon {
  constructor(public g: Engine) {
    super("scimitar", "martial", "melee", dd(1, 6, "slashing"), [
      "finesse",
      "light",
    ]);
  }
}

export class Shortsword extends AbstractWeapon {
  constructor(public g: Engine) {
    super("shortsword", "martial", "melee", dd(1, 6, "piercing"), [
      "finesse",
      "light",
    ]);
  }
}

export class Trident extends AbstractWeapon {
  constructor(public g: Engine, quantity: number) {
    super(
      "trident",
      "martial",
      "melee",
      dd(1, 6, "piercing"),
      ["thrown", "versatile"],
      20,
      60
    );
    this.quantity = quantity;
  }
}

export class WarPick extends AbstractWeapon {
  constructor(public g: Engine) {
    super("war pick", "martial", "melee", dd(1, 8, "piercing"));
  }
}

export class Warhammer extends AbstractWeapon {
  constructor(public g: Engine) {
    super("warhammer", "martial", "melee", dd(1, 8, "bludgeoning"), [
      "versatile",
    ]);
  }
}

export class Whip extends AbstractWeapon {
  constructor(public g: Engine) {
    super("whip", "martial", "melee", dd(1, 4, "slashing"), [
      "finesse",
      "reach",
    ]);
  }
}

export class Blowgun extends AbstractWeapon {
  constructor(public g: Engine) {
    super(
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
  constructor(public g: Engine) {
    super(
      "hand crossbow",
      "martial",
      "ranged",
      dd(1, 6, "piercing"),
      ["ammunition", "light", "loading"],
      30,
      120
    );
    this.ammunitionTag = "crossbow";
  }
}

export class HeavyCrossbow extends AbstractWeapon {
  constructor(public g: Engine) {
    super(
      "heavy crossbow",
      "martial",
      "ranged",
      dd(1, 10, "piercing"),
      ["ammunition", "heavy", "loading", "two-handed"],
      100,
      400
    );
    this.ammunitionTag = "crossbow";
  }
}

export class Longbow extends AbstractWeapon {
  constructor(public g: Engine) {
    super(
      "longbow",
      "martial",
      "ranged",
      dd(1, 8, "piercing"),
      ["ammunition", "heavy", "two-handed"],
      150,
      600
    );
    this.ammunitionTag = "bow";
  }
}

export class Net extends AbstractWeapon {
  constructor(public g: Engine, quantity: number) {
    super(
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
