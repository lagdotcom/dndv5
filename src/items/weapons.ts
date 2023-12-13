import clubUrl from "@img/eq/club.svg";
import greataxeUrl from "@img/eq/greataxe.svg";
import lightCrossbowUrl from "@img/eq/light-crossbow.svg";
import longbowUrl from "@img/eq/longbow.svg";
import longswordUrl from "@img/eq/longsword.svg";
import maceUrl from "@img/eq/mace.svg";
import quarterstaffUrl from "@img/eq/quarterstaff.svg";
import rapierUrl from "@img/eq/rapier.svg";
import spearUrl from "@img/eq/spear.svg";
import tridentUrl from "@img/eq/trident.svg";

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
import { _dd, _fd } from "../utils/dice";
import { SetInitialiser } from "../utils/set";
import { distance } from "../utils/units";
import AbstractItem from "./AbstractItem";

export abstract class AbstractWeapon
  extends AbstractItem<"weapon">
  implements WeaponItem
{
  ammunitionTag?: AmmunitionTag;
  forceAbilityScore?: AbilityName;
  properties: Set<WeaponProperty>;
  quantity: number;

  constructor(
    public g: Engine,
    name: string,
    public category: WeaponCategory,
    public rangeCategory: WeaponRangeCategory,
    public damage: DamageAmount,
    properties?: SetInitialiser<WeaponProperty>,
    iconUrl?: string,
    public shortRange?: number,
    public longRange?: number,
    public weaponType = name,
  ) {
    super(g, "weapon", name, 1, iconUrl);

    this.properties = new Set(properties);
    this.quantity = 1;
  }

  get reach() {
    return this.properties.has("reach") ? 5 : 0;
  }
}

export class Club extends AbstractWeapon {
  constructor(g: Engine) {
    super(
      g,
      "club",
      "simple",
      "melee",
      _dd(1, 4, "bludgeoning"),
      ["light"],
      clubUrl,
    );
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
      undefined, // TODO [ICON]
      20,
      60,
    );
    this.quantity = quantity;
  }
}

export class Greatclub extends AbstractWeapon {
  constructor(g: Engine) {
    super(
      g,
      "greatclub",
      "simple",
      "melee",
      _dd(1, 8, "bludgeoning"),
      ["two-handed"],
      undefined, // TODO [ICON]
    );
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
      undefined, // TODO [ICON]
      20,
      60,
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
      undefined, // TODO [ICON]
      30,
      120,
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
      undefined, // TODO [ICON]
      20,
      60,
    );
    this.quantity = quantity;
  }
}

export class Mace extends AbstractWeapon {
  constructor(g: Engine) {
    super(
      g,
      "mace",
      "simple",
      "melee",
      _dd(1, 6, "bludgeoning"),
      undefined,
      maceUrl,
    );
  }
}

export class Quarterstaff extends AbstractWeapon {
  constructor(g: Engine) {
    super(
      g,
      "quarterstaff",
      "simple",
      "melee",
      _dd(1, 6, "bludgeoning"),
      ["versatile"],
      quarterstaffUrl,
    );
  }
}

export class Sickle extends AbstractWeapon {
  constructor(g: Engine) {
    super(
      g,
      "sickle",
      "simple",
      "melee",
      _dd(1, 4, "slashing"),
      ["light"],
      undefined, // TODO [ICON]
    );
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
      spearUrl,
      20,
      60,
    );
    this.quantity = quantity;
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
      lightCrossbowUrl,
      80,
      320,
    );
    this.ammunitionTag = "crossbow";
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
      undefined, // TODO [ICON]
      20,
      60,
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
      undefined, // TODO [ICON]
      80,
      320,
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
      undefined, // TODO [ICON]
      30,
      120,
    );
    this.ammunitionTag = "sling";
  }
}

export class Battleaxe extends AbstractWeapon {
  constructor(g: Engine) {
    super(
      g,
      "battleaxe",
      "martial",
      "melee",
      _dd(1, 8, "slashing"),
      ["versatile"],
      undefined, // TODO [ICON]
    );
  }
}

export class Flail extends AbstractWeapon {
  constructor(g: Engine) {
    super(
      g,
      "flail",
      "martial",
      "melee",
      _dd(1, 8, "bludgeoning"),
      undefined, // TODO [ICON]
    );
  }
}

export class Glaive extends AbstractWeapon {
  constructor(g: Engine) {
    super(
      g,
      "glaive",
      "martial",
      "melee",
      _dd(1, 10, "slashing"),
      ["heavy", "reach", "two-handed"],
      undefined, // TODO [ICON]
    );
  }
}

export class Greataxe extends AbstractWeapon {
  constructor(g: Engine) {
    super(
      g,
      "greataxe",
      "martial",
      "melee",
      _dd(1, 12, "slashing"),
      ["heavy", "two-handed"],
      greataxeUrl,
    );
  }
}

export class Greatsword extends AbstractWeapon {
  constructor(g: Engine) {
    super(
      g,
      "greatsword",
      "martial",
      "melee",
      _dd(2, 6, "slashing"),
      ["heavy", "two-handed"],
      undefined, // TODO [ICON]
    );
  }
}

export class Halberd extends AbstractWeapon {
  constructor(g: Engine) {
    super(
      g,
      "halberd",
      "martial",
      "melee",
      _dd(1, 10, "slashing"),
      ["heavy", "reach", "two-handed"],
      undefined, // TODO [ICON]
    );
  }
}

export class Lance extends AbstractWeapon {
  constructor(g: Engine) {
    super(
      g,
      "lance",
      "martial",
      "melee",
      _dd(1, 12, "piercing"),
      ["reach"],
      undefined, // TODO [ICON]
    );
    // You have disadvantage when you use a lance to attack a target within 5 feet of you.
    g.events.on(
      "BeforeAttack",
      ({ detail: { weapon, who, target, diceType } }) => {
        if (weapon === this && distance(who, target) <= 5)
          diceType.add("disadvantage", this);
      },
    );

    // TODO [HANDS] Also, a lance requires two hands to wield when you aren't mounted.
  }
}

export class Longsword extends AbstractWeapon {
  constructor(g: Engine) {
    super(
      g,
      "longsword",
      "martial",
      "melee",
      _dd(1, 8, "slashing"),
      ["versatile"],
      longswordUrl,
    );
  }
}

export class Maul extends AbstractWeapon {
  constructor(g: Engine) {
    super(
      g,
      "maul",
      "martial",
      "melee",
      _dd(2, 6, "bludgeoning"),
      ["heavy", "two-handed"],
      undefined, // TODO [ICON]
    );
  }
}

export class Morningstar extends AbstractWeapon {
  constructor(g: Engine) {
    super(
      g,
      "morningstar",
      "martial",
      "melee",
      _dd(1, 8, "piercing"),
      undefined,
      undefined, // TODO [ICON]
    );
  }
}

export class Pike extends AbstractWeapon {
  constructor(g: Engine) {
    super(
      g,
      "pike",
      "martial",
      "melee",
      _dd(1, 10, "piercing"),
      ["heavy", "reach", "two-handed"],
      undefined, // TODO [ICON]
    );
  }
}

export class Rapier extends AbstractWeapon {
  constructor(g: Engine) {
    super(
      g,
      "rapier",
      "martial",
      "melee",
      _dd(1, 8, "piercing"),
      ["finesse"],
      rapierUrl,
    );
  }
}

export class Scimitar extends AbstractWeapon {
  constructor(g: Engine) {
    super(
      g,
      "scimitar",
      "martial",
      "melee",
      _dd(1, 6, "slashing"),
      ["finesse", "light"],
      undefined, // TODO [ICON]
    );
  }
}

export class Shortsword extends AbstractWeapon {
  constructor(g: Engine) {
    super(
      g,
      "shortsword",
      "martial",
      "melee",
      _dd(1, 6, "piercing"),
      ["finesse", "light"],
      undefined, // TODO [ICON]
    );
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
      tridentUrl,
      20,
      60,
    );
    this.quantity = quantity;
  }
}

export class WarPick extends AbstractWeapon {
  constructor(g: Engine) {
    super(
      g,
      "war pick",
      "martial",
      "melee",
      _dd(1, 8, "piercing"),
      undefined,
      undefined, // TODO [ICON]
    );
  }
}

export class Warhammer extends AbstractWeapon {
  constructor(g: Engine) {
    super(
      g,
      "warhammer",
      "martial",
      "melee",
      _dd(1, 8, "bludgeoning"),
      ["versatile"],
      undefined, // TODO [ICON]
    );
  }
}

export class Whip extends AbstractWeapon {
  constructor(g: Engine) {
    super(
      g,
      "whip",
      "martial",
      "melee",
      _dd(1, 4, "slashing"),
      ["finesse", "reach"],
      undefined, // TODO [ICON]
    );
  }
}

export class Blowgun extends AbstractWeapon {
  constructor(g: Engine) {
    super(
      g,
      "blowgun",
      "martial",
      "ranged",
      _fd(1, "piercing"),
      ["ammunition", "loading"],
      undefined, // TODO [ICON]
      25,
      100,
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
      undefined, // TODO [ICON]
      30,
      120,
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
      undefined, // TODO [ICON]
      100,
      400,
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
      longbowUrl,
      150,
      600,
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
      _fd(0, "bludgeoning"),
      ["thrown"],
      undefined, // TODO [ICON]
      5,
      15,
    );
    this.quantity = quantity;

    // TODO A Large or smaller creature hit by a net is restrained until it is freed. A net has no effect on creatures that are formless, or creatures that are Huge or larger. A creature can use its action to make a DC 10 Strength check, freeing itself or another creature within its reach on a success. Dealing 5 slashing damage to the net (AC 10) also frees the creature without harming it, ending the effect and destroying the net. When you use an action, bonus action, or reaction to attack with a net, you can make only one attack regardless of the number of attacks you can normally make.
  }
}
