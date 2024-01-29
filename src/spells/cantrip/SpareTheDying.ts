import { HasTarget } from "../../configs";
import { Dead, Dying, Stable } from "../../effects";
import { doesNotHaveEffect, hasEffect, notOfCreatureType } from "../../filters";
import { simpleSpell } from "../common";
import { touchTarget } from "../helpers";

const SpareTheDying = simpleSpell<HasTarget>({
  status: "implemented",
  name: "Spare the Dying",
  level: 0,
  school: "Necromancy",
  v: true,
  s: true,
  lists: ["Artificer", "Cleric"],
  description: `You touch a living creature that has 0 hit points. The creature becomes stable. This spell has no effect on undead or constructs.`,

  ...touchTarget([
    doesNotHaveEffect(Dead),
    hasEffect(Dying),
    notOfCreatureType("undead", "construct"),
  ]),

  async apply(sh) {
    for (const target of sh.affected) {
      await target.removeEffect(Dying);
      await target.addEffect(Stable, { duration: Infinity });
    }
  },
});
export default SpareTheDying;
