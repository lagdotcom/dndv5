import Engine from "../../../Engine";
import { Listener } from "../../../events/Dispatcher";
import AbilityName from "../../../types/AbilityName";
import { isEquipmentAttuned } from "../../../utils/items";
import WondrousItemBase from "../../WondrousItemBase";

/* TODO Thereafter, another creature must use an action to grasp or net the stone to separate it from you, either by making a successful attack roll against AC 24 or a successful DC 24 Dexterity (Acrobatics) check. You can use an action to seize and stow the stone, ending its effect.

A stone has AC 24, 10 hit points, and resistance to all damage. It is considered to be an object that is being worn while it orbits your head. */

class AbilityIounStone extends WondrousItemBase {
  constructor(g: Engine, name: string, ability: AbilityName) {
    super(g, `Ioun stone of ${name}`);
    this.attunement = true;
    this.rarity = "Very Rare";

    g.events.on("CombatantFinalising", ({ detail: { who } }) => {
      if (isEquipmentAttuned(this, who)) who[ability].score += 2;
    });
  }
}

export const iounStoneOfAgility = (g: Engine) =>
  new AbilityIounStone(g, "Agility", "dex");
export const iounStoneOfFortitude = (g: Engine) =>
  new AbilityIounStone(g, "Fortitude", "con");
export const iounStoneOfInsight = (g: Engine) =>
  new AbilityIounStone(g, "Insight", "wis");
export const iounStoneOfIntellect = (g: Engine) =>
  new AbilityIounStone(g, "Intellect", "int");
export const iounStoneOfLeadership = (g: Engine) =>
  new AbilityIounStone(g, "Leadership", "cha");
export const iounStoneOfStrength = (g: Engine) =>
  new AbilityIounStone(g, "Strength", "str");

export class IounStoneOfMastery extends WondrousItemBase {
  constructor(g: Engine) {
    super(g, "Ioun stone of mastery");
    this.attunement = true;
    this.rarity = "Legendary";

    // Your proficiency bonus increases by 1 while this pale green prism orbits your head.
    const handler: Listener<"BeforeAttack" | "BeforeCheck" | "BeforeSave"> = ({
      detail,
    }) => {
      if (isEquipmentAttuned(this, detail.who)) detail.pb.add(1, this);
    };

    g.events.on("BeforeAttack", handler);
    g.events.on("BeforeCheck", handler);
    g.events.on("BeforeSave", handler);
  }
}

export class IounStoneOfProtection extends WondrousItemBase {
  constructor(g: Engine) {
    super(g, "Ioun stone of protection");
    this.attunement = true;
    this.rarity = "Rare";

    // You gain a +1 bonus to AC while this dusty rose prism orbits your head.
    g.events.on("GetAC", ({ detail: { who, bonus } }) => {
      if (isEquipmentAttuned(this, who)) bonus.add(1, this);
    });
  }
}
