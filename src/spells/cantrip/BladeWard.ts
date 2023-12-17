import Effect from "../../Effect";
import { MundaneDamageTypes } from "../../types/DamageType";
import { isA } from "../../utils/types";
import { simpleSpell } from "../common";

const BladeWardEffect = new Effect(
  "Blade Ward",
  "turnStart",
  (g) => {
    g.events.on(
      "GetDamageResponse",
      ({ detail: { who, attack, damageType, response } }) => {
        if (
          who.hasEffect(BladeWardEffect) &&
          attack?.pre.weapon &&
          isA(damageType, MundaneDamageTypes)
        )
          response.add("resist", BladeWardEffect);
      },
    );
  },
  { tags: ["magic"] },
);

const BladeWard = simpleSpell({
  status: "implemented",
  name: "Blade Ward",
  level: 0,
  school: "Abjuration",
  v: true,
  s: true,
  lists: ["Bard", "Sorcerer", "Warlock", "Wizard"],
  description: `You extend your hand and trace a sigil of warding in the air. Until the end of your next turn, you have resistance against bludgeoning, piercing, and slashing damage dealt by weapon attacks.`,

  getConfig: () => ({}),
  getAffected: (g, caster) => [caster],
  getTargets: () => [],

  async apply(g, caster) {
    await caster.addEffect(BladeWardEffect, { duration: 1 });
  },
});
export default BladeWard;
