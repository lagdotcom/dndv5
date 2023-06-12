import { HasTarget } from "../../configs";
import Effect from "../../Effect";
import TargetResolver from "../../resolvers/TargetResolver";
import CreatureType from "../../types/CreatureType";
import { minutes } from "../../utils/time";
import { simpleSpell } from "../common";

const affectedTypes: CreatureType[] = [
  "aberration",
  "celestial",
  "elemental",
  "fey",
  "fiend",
  "undead",
];

// TODO [CANCELEFFECT] [CANCELCONDITION] The protection grants several benefits. Creatures of those types have disadvantage on attack rolls against the target. The target also can't be charmed, frightened, or possessed by them. If the target is already charmed, frightened, or possessed by such a creature, the target has advantage on any new saving throw against the relevant effect.
const ProtectionEffect = new Effect(
  "Protection from Evil and Good",
  "turnStart",
  (g) => {
    g.events.on("BeforeAttack", ({ detail: { who, target, diceType } }) => {
      if (
        affectedTypes.includes(target.type) &&
        who.hasEffect(ProtectionEffect)
      )
        diceType.add("disadvantage", ProtectionEffect);
    });
  }
);

const ProtectionFromEvilAndGood = simpleSpell<HasTarget>({
  name: "Protection from Evil and Good",
  level: 1,
  school: "Abjuration",
  concentration: true,
  v: true,
  s: true,
  m: "holy water or powdered silver and iron, which the spell consumes",
  lists: ["Cleric", "Paladin", "Warlock", "Wizard"],

  getConfig: (g, caster) => ({
    target: new TargetResolver(g, caster.reach, true),
  }),
  getTargets: (g, caster, { target }) => [target],

  async apply(g, caster, method, { target }) {
    const duration = minutes(10);
    target.addEffect(ProtectionEffect, { duration });

    await caster.concentrateOn({
      spell: ProtectionFromEvilAndGood,
      duration,
      async onSpellEnd() {
        target.removeEffect(ProtectionEffect);
      },
    });
  },
});
export default ProtectionFromEvilAndGood;
