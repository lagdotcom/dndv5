import iconUrl from "@img/spl/hellish-rebuke.svg";

import { isCastSpell } from "../../actions/CastSpell";
import { DamageColours, makeIcon } from "../../colours";
import { HasTarget } from "../../configs";
import DndRule from "../../DndRule";
import PickFromListChoice from "../../interruptions/PickFromListChoice";
import TargetResolver from "../../resolvers/TargetResolver";
import { atSet } from "../../types/AttackTag";
import { sieve } from "../../utils/array";
import { checkConfig } from "../../utils/config";
import { enumerate } from "../../utils/numbers";
import { scalingSpell } from "../common";

new DndRule("Hellish Rebuke", (g) => {
  g.events.on(
    "CombatantDamaged",
    ({ detail: { who, attacker, interrupt } }) => {
      const rebuke = g.getActions(who).flatMap((action) => {
        if (!isCastSpell(action, HellishRebuke)) return [];

        const minSlot =
          action.method.getMinSlot?.(HellishRebuke, who) ?? HellishRebuke.level;
        const maxSlot =
          action.method.getMaxSlot?.(HellishRebuke, who) ?? HellishRebuke.level;

        return enumerate(minSlot, maxSlot)
          .map((slot) => ({
            action,
            config: { target: attacker, slot },
          }))
          .filter(({ action, config }) => checkConfig(g, action, config));
      });
      if (!rebuke.length) return;

      interrupt.add(
        new PickFromListChoice(
          who,
          HellishRebuke,
          "Hellish Rebuke",
          `${attacker.name} damaged ${who.name}. Respond by casting Hellish Rebuke?`,
          rebuke.map((value) => ({ value, label: value.action.name })),
          async ({ action, config }) => {
            await g.act(action, config);
          },
          true,
          1,
        ),
      );
    },
  );
});

const HellishRebuke = scalingSpell<HasTarget>({
  status: "implemented",
  name: "Hellish Rebuke",
  level: 1,
  school: "Evocation",
  time: "reaction",
  v: true,
  s: true,
  lists: ["Warlock"],
  description: `You point your finger, and the creature that damaged you is momentarily surrounded by hellish flames. The creature must make a Dexterity saving throw. It takes 2d10 fire damage on a failed save, or half as much damage on a successful one.

  At Higher Levels. When you cast this spell using a spell slot of 2nd level or higher, the damage increases by 1d10 for each slot level above 1st.`,
  icon: makeIcon(iconUrl, DamageColours.fire),
  isHarmful: true,

  getConfig: (g) => ({ target: new TargetResolver(g, 60, []) }),
  getTargets: (g, caster, { target }) => sieve(target),
  getAffected: (g, caster, { target }) => [target],

  async apply(g, attacker, method, { slot, target }) {
    const damage = await g.rollDamage(slot + 1, {
      source: HellishRebuke,
      size: 10,
      attacker,
      target,
      damageType: "fire",
      tags: atSet("magical", "spell"),
    });

    const { damageResponse } = await g.save({
      source: HellishRebuke,
      type: method.getSaveType(attacker, HellishRebuke, slot),
      who: target,
      attacker,
      ability: "dex",
      tags: ["magic"],
    });

    await g.damage(
      HellishRebuke,
      "fire",
      { attacker, target },
      [["fire", damage]],
      damageResponse,
    );
  },
});
export default HellishRebuke;
