import iconUrl from "@img/spl/hellish-rebuke.svg";

import { isCastSpell } from "../../actions/CastSpell";
import { DamageColours, makeIcon } from "../../colours";
import { HasTarget } from "../../configs";
import DndRule from "../../DndRule";
import PickFromListChoice from "../../interruptions/PickFromListChoice";
import Priority from "../../types/Priority";
import { checkConfig } from "../../utils/config";
import { enumerate } from "../../utils/numbers";
import { scalingSpell } from "../common";
import { doesScalingDamage, targetsOne } from "../helpers";

new DndRule("Hellish Rebuke", (g) => {
  g.events.on(
    "CombatantDamaged",
    ({ detail: { who, attacker, interrupt } }) => {
      if (!attacker) return;

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
          Priority.Late,
          rebuke.map((value) => ({ value, label: value.action.name })),
          async ({ action, config }) => {
            await g.act(action, config);
          },
          true,
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

  ...targetsOne(60, []),
  ...doesScalingDamage(1, 1, 10, "fire"),

  async apply(sh, { target }) {
    const damageInitialiser = await sh.rollDamage({ target, tags: ["ranged"] });
    const { damageResponse } = await sh.save({ who: target, ability: "dex" });

    await sh.damage({
      damageInitialiser,
      damageResponse,
      damageType: "fire",
      target,
    });
  },
});
export default HellishRebuke;
