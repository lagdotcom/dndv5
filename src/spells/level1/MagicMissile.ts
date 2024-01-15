import iconUrl from "@img/spl/magic-missile.svg";

import { DamageColours, makeIcon } from "../../colours";
import { HasAllocations } from "../../configs";
import { canSee } from "../../filters";
import { DiceCount, ModifiedDiceRoll, SpellSlot } from "../../flavours";
import AllocationResolver from "../../resolvers/AllocationResolver";
import { atSet } from "../../types/AttackTag";
import { _dd, _fd } from "../../utils/dice";
import { scalingSpell } from "../common";

const getDamage = (slot: SpellSlot) => [
  _dd(slot + 2, 4, "force"),
  _fd(slot + 2, "force"),
];

const MagicMissile = scalingSpell<HasAllocations<DiceCount>>({
  status: "implemented",
  name: "Magic Missile",
  icon: makeIcon(iconUrl, DamageColours.force),
  level: 1,
  school: "Evocation",
  v: true,
  s: true,
  lists: ["Sorcerer", "Wizard"],
  isHarmful: true,
  description: `You create three glowing darts of magical force. Each dart hits a creature of your choice that you can see within range. A dart deals 1d4 + 1 force damage to its target. The darts all strike simultaneously, and you can direct them to hit one creature or several.

  At Higher Levels. When you cast this spell using a spell slot of 2nd level or higher, the spell creates one more dart for each slot level above 1st.`,

  // TODO: generateAttackConfigs

  getConfig: (g, caster, method, { slot }) => ({
    targets: new AllocationResolver(
      g,
      "Missiles",
      (slot ?? 1) + 2,
      (slot ?? 1) + 2,
      120,
      [canSee],
    ),
  }),
  getDamage: (g, caster, method, { slot }) => getDamage(slot ?? 1),
  getTargets: (g, caster, { targets }) => targets?.map((e) => e.who) ?? [],
  getAffected: (g, caster, { targets }) => targets.map((e) => e.who),

  async apply({ g, method, caster: attacker }, { targets }) {
    const perBolt: ModifiedDiceRoll =
      (await g.rollDamage(1, {
        source: MagicMissile,
        spell: MagicMissile,
        method,
        attacker,
        damageType: "force",
        size: 4,
        tags: atSet("magical", "spell"),
      })) + 1;

    for (const { amount, who } of targets) {
      if (amount < 1) continue;

      await g.damage(
        MagicMissile,
        "force",
        { spell: MagicMissile, method, target: who, attacker },
        [["force", perBolt * amount]],
      );
    }
  },
});
export default MagicMissile;
