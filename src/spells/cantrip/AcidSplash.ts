import { HasTargets } from "../../configs";
import MultiTargetResolver from "../../resolvers/MultiTargetResolver";
import { _dd } from "../../utils/dice";
import { getSaveDC } from "../../utils/dnd";
import { isCombatantArray } from "../../utils/types";
import { distance } from "../../utils/units";
import { getCantripDice, simpleSpell } from "../common";

const AcidSplash = simpleSpell<HasTargets>({
  status: "implemented",
  name: "Acid Splash",
  level: 0,
  school: "Conjuration",
  v: true,
  s: true,
  lists: ["Artificer", "Sorcerer", "Wizard"],

  getConfig: (g) => ({ targets: new MultiTargetResolver(g, 1, 2, 60) }),
  getDamage: (g, caster) => [_dd(getCantripDice(caster), 6, "acid")],
  getTargets: (g, caster, { targets }) => targets,

  check(g, { targets }, ec) {
    if (isCombatantArray(targets) && targets.length === 2) {
      const [a, b] = targets;
      if (distance(g, a, b) > 5)
        ec.add("Targets are not within 5 feet of each other", AcidSplash);
    }

    return ec;
  },

  async apply(g, attacker, method, { targets }) {
    const count = getCantripDice(attacker);

    const damage = await g.rollDamage(count, {
      source: AcidSplash,
      size: 6,
      attacker,
      spell: AcidSplash,
      method,
      damageType: "acid",
    });

    for (const target of targets) {
      const save = await g.savingThrow(
        getSaveDC(attacker, method.ability),
        {
          who: target,
          attacker,
          ability: "dex",
          spell: AcidSplash,
          method,
          tags: new Set(),
        },
        { fail: "normal", save: "zero" },
      );

      await g.damage(
        AcidSplash,
        "acid",
        { attacker, target, spell: AcidSplash, method },
        [["acid", damage]],
        save.damageResponse,
      );
    }
  },
});
export default AcidSplash;
