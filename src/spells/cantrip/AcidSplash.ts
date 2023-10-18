import iconUrl from "@img/spl/acid-splash.svg";

import { DamageColours, makeIcon } from "../../colours";
import { HasTargets } from "../../configs";
import { canSee } from "../../filters";
import MultiTargetResolver from "../../resolvers/MultiTargetResolver";
import { _dd } from "../../utils/dice";
import { isCombatantArray } from "../../utils/types";
import { distance } from "../../utils/units";
import { getCantripDice, simpleSpell } from "../common";

const AcidSplash = simpleSpell<HasTargets>({
  status: "implemented",
  name: "Acid Splash",
  icon: makeIcon(iconUrl, DamageColours.acid),
  level: 0,
  school: "Conjuration",
  v: true,
  s: true,
  lists: ["Artificer", "Sorcerer", "Wizard"],
  description: `You hurl a bubble of acid. Choose one creature you can see within range, or choose two creatures you can see within range that are within 5 feet of each other. A target must succeed on a Dexterity saving throw or take 1d6 acid damage.

  This spell's damage increases by 1d6 when you reach 5th level (2d6), 11th level (3d6), and 17th level (4d6).`,

  getConfig: (g) => ({
    targets: new MultiTargetResolver(g, 1, 2, 60, [canSee]),
  }),
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
      const { damageResponse } = await g.save({
        source: AcidSplash,
        type: method.getSaveType(attacker, AcidSplash),
        who: target,
        attacker,
        ability: "dex",
        spell: AcidSplash,
        method,
        fail: "normal",
        save: "zero",
      });

      await g.damage(
        AcidSplash,
        "acid",
        { attacker, target, spell: AcidSplash, method },
        [["acid", damage]],
        damageResponse,
      );
    }
  },
});
export default AcidSplash;
