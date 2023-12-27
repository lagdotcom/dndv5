import { HasCaster, HasTarget } from "../../configs";
import Effect from "../../Effect";
import TargetResolver from "../../resolvers/TargetResolver";
import Item from "../../types/Item";
import { sieve } from "../../utils/array";
import { hours } from "../../utils/time";
import { simpleSpell } from "../common";

const MageArmorEffect = new Effect<HasCaster>(
  "Mage Armor",
  "turnStart",
  (g) => {
    g.events.on("GetACMethods", ({ detail }) => {
      if (detail.who.hasEffect(MageArmorEffect) && !detail.who.armor) {
        const uses = new Set<Item>();
        let ac = 13 + detail.who.dex.modifier;
        if (detail.who.shield) {
          uses.add(detail.who.shield);
          ac += detail.who.shield.ac;
        }

        detail.methods.push({
          name: "Mage Armor",
          ac,
          uses,
        });
      }
    });
  },
  { tags: ["magic"] },
);

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

  getConfig: (g, caster) => ({
    target: new TargetResolver(g, caster.reach, [
      {
        name: "no armor",
        message: "wearing armor",
        check: (g, action, value) => !value.armor,
      },
    ]),
  }),

  getTargets: (g, caster, { target }) => sieve(target),
  getAffected: (g, caster, { target }) => [target],

  async apply(g, caster, method, { target }) {
    const duration = hours(8);
    await target.addEffect(MageArmorEffect, { duration, caster, method });

    caster.concentrateOn({
      duration,
      spell: MageArmor,
      async onSpellEnd() {
        await target.removeEffect(MageArmorEffect);
      },
    });
  },
});
export default MageArmor;
