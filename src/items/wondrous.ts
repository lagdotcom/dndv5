import Engine from "../Engine";
import { WondrousItem } from "../types/Item";
import AbstractItem from "./AbstractItem";

export class AbstractWondrous
  extends AbstractItem<"wondrous">
  implements WondrousItem
{
  constructor(g: Engine, name: string, public hands = 0) {
    super(g, "wondrous", name);
  }
}

export class BracersOfTheArbalest extends AbstractWondrous {
  constructor(g: Engine) {
    super(g, "Bracers of the Arbalest");

    // TODO While wearing these bracers, you have proficiency with all crossbows

    // ... you gain a +2 bonus to damage rolls on ranged attacks made with such weapons.
    g.events.on("gatherDamage", ({ detail: { attacker, weapon, bonus } }) => {
      if (
        attacker.equipment.has(this) &&
        attacker.attunements.has(this) &&
        weapon?.ammunitionTag === "crossbow"
      )
        bonus.add(2, this);
    });
  }
}

export class CloakOfProtection extends AbstractWondrous {
  constructor(g: Engine) {
    super(g, "Cloak of Protection");

    g.events.on("getACMethods", ({ detail: { who, methods } }) => {
      if (who.equipment.has(this) && who.attunements.has(this))
        for (const method of methods) {
          method.ac++;
          method.uses.add(this);
        }
    });

    g.events.on("beforeSave", ({ detail: { who, bonus } }) => {
      if (who.equipment.has(this) && who.attunements.has(this))
        bonus.add(1, this);
    });
  }
}

export const DragonTouchedLevels = ["Slumbering"] as const;
export type DragonTouchedLevel = (typeof DragonTouchedLevels)[number];

export class DragonTouchedFocus extends AbstractWondrous {
  constructor(g: Engine, level: DragonTouchedLevel) {
    super(g, `Dragon-Touched Focus (${level})`, 1);

    // TODO While you are holding the focus, it can function as a spellcasting focus for all your spells.
    g.events.on("getInitiative", ({ detail: { who, diceType } }) => {
      if (who.equipment.has(this) && who.attunements.has(this))
        diceType.add("advantage", this);
    });
  }
}
