import iconUrl from "@img/spl/shield-of-faith.svg";

import { makeIcon } from "../../colours";
import { HasTarget } from "../../configs";
import Effect from "../../Effect";
import { minutes } from "../../utils/time";
import { simpleSpell } from "../common";
import { targetsOne } from "../helpers";

const ShieldOfFaithIcon = makeIcon(iconUrl);

const ShieldOfFaithEffect = new Effect(
  "Shield of Faith",
  "turnStart",
  (g) => {
    g.events.on("GetAC", ({ detail: { who, bonus } }) => {
      if (who.hasEffect(ShieldOfFaithEffect)) bonus.add(2, ShieldOfFaith);
    });
  },
  { icon: ShieldOfFaithIcon, tags: ["magic"] },
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

  ...targetsOne(60, []),

  async apply({ caster }, { target }) {
    await target.addEffect(
      ShieldOfFaithEffect,
      { duration: minutes(10) },
      caster,
    );

    caster.concentrateOn({
      spell: ShieldOfFaith,
      duration: minutes(10),
      onSpellEnd: () => target.removeEffect(ShieldOfFaithEffect),
    });
  },
});
export default ShieldOfFaith;
