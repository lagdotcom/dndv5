import { HasCaster, HasTarget } from "../../configs";
import Effect from "../../Effect";
import { ErrorFilter } from "../../filters";
import Combatant from "../../types/Combatant";
import Item from "../../types/Item";
import { hours } from "../../utils/time";
import { simpleSpell } from "../common";
import { targetsByTouch } from "../helpers";

const MageArmorEffect = new Effect<HasCaster>(
  "Mage Armor",
  "turnStart",
  (g) => {
    g.events.on("GetACMethods", ({ detail: { who, methods } }) => {
      if (who.hasEffect(MageArmorEffect) && !who.armor) {
        const uses = new Set<Item>();
        let ac = 13 + who.dex.modifier;
        if (who.shield) {
          uses.add(who.shield);
          ac += who.shield.ac;
        }

        methods.push({ name: "Mage Armor", ac, uses });
      }
    });
  },
  { tags: ["magic"] },
);

const notWearingArmor: ErrorFilter<Combatant> = {
  name: "no armor",
  message: "wearing armor",
  check: (g, action, value) => !value.armor,
};

const MageArmor = simpleSpell<HasTarget>({
  status: "implemented",
  name: "Mage Armor",
  level: 1,
  school: "Abjuration",
  concentration: true,
  v: true,
  s: true,
  m: "a piece of cured leather",
  lists: ["Sorcerer", "Wizard"],
  description: `You touch a willing creature who isn't wearing armor, and a protective magical force surrounds it until the spell ends. The target's base AC becomes 13 + its Dexterity modifier. The spell ends if the target dons armor or if you dismiss the spell as an action.`,

  ...targetsByTouch([notWearingArmor]),

  async apply({ caster, method }, { target }) {
    await target.addEffect(MageArmorEffect, {
      duration: hours(8),
      caster,
      method,
    });
  },
});
export default MageArmor;
