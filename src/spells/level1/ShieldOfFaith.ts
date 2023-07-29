import { HasTarget } from "../../configs";
import Effect from "../../Effect";
import TargetResolver from "../../resolvers/TargetResolver";
import { minutes } from "../../utils/time";
import { simpleSpell } from "../common";

const ShieldOfFaithEffect = new Effect("Shield of Faith", "turnStart", (g) => {
  g.events.on("GetAC", ({ detail: { who, bonus } }) => {
    if (who.hasEffect(ShieldOfFaithEffect)) bonus.add(2, ShieldOfFaith);
  });
});

const ShieldOfFaith = simpleSpell<HasTarget>({
  status: "implemented",
  name: "Shield of Faith",
  level: 1,
  school: "Abjuration",
  time: "bonus action",
  v: true,
  s: true,
  m: "a small parchment with a bit of holy text written on it",
  lists: ["Cleric", "Paladin"],

  getConfig: (g) => ({ target: new TargetResolver(g, 60, true) }),
  getTargets: (g, caster, { target }) => [target],

  async apply(g, caster, method, { target }) {
    target.addEffect(ShieldOfFaithEffect, { duration: minutes(10) });

    caster.concentrateOn({
      spell: ShieldOfFaith,
      duration: minutes(10),
      onSpellEnd: async () => target.removeEffect(ShieldOfFaithEffect),
    });
  },
});
export default ShieldOfFaith;
