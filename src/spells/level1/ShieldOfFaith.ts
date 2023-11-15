import iconUrl from "@img/spl/shield-of-faith.svg";

import { makeIcon } from "../../colours";
import { HasTarget } from "../../configs";
import Effect from "../../Effect";
import TargetResolver from "../../resolvers/TargetResolver";
import { sieve } from "../../utils/array";
import { minutes } from "../../utils/time";
import { simpleSpell } from "../common";

const ShieldOfFaithIcon = makeIcon(iconUrl);

const ShieldOfFaithEffect = new Effect(
  "Shield of Faith",
  "turnStart",
  (g) => {
    g.events.on("GetAC", ({ detail: { who, bonus } }) => {
      if (who.hasEffect(ShieldOfFaithEffect)) bonus.add(2, ShieldOfFaith);
    });
  },
  { icon: ShieldOfFaithIcon },
);

const ShieldOfFaith = simpleSpell<HasTarget>({
  status: "implemented",
  name: "Shield of Faith",
  icon: ShieldOfFaithIcon,
  level: 1,
  school: "Abjuration",
  time: "bonus action",
  v: true,
  s: true,
  m: "a small parchment with a bit of holy text written on it",
  lists: ["Cleric", "Paladin"],
  description: `A shimmering field appears and surrounds a creature of your choice within range, granting it a +2 bonus to AC for the duration.`,

  getConfig: (g) => ({ target: new TargetResolver(g, 60, []) }),
  getTargets: (g, caster, { target }) => sieve(target),
  getAffected: (g, caster, { target }) => [target],

  async apply(g, caster, method, { target }) {
    await target.addEffect(
      ShieldOfFaithEffect,
      { duration: minutes(10) },
      caster,
    );

    caster.concentrateOn({
      spell: ShieldOfFaith,
      duration: minutes(10),
      onSpellEnd: async () => {
        await target.removeEffect(ShieldOfFaithEffect);
      },
    });
  },
});
export default ShieldOfFaith;
