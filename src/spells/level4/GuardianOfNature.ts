import Effect from "../../Effect";
import EvaluateLater from "../../interruptions/EvaluateLater";
import { PickChoice } from "../../interruptions/PickFromListChoice";
import ChoiceResolver from "../../resolvers/ChoiceResolver";
import { minutes } from "../../utils/time";
import { simpleSpell } from "../common";

type Form = "Primal Beast" | "Great Tree";
const PrimalBeast: Form = "Primal Beast";
const GreatTree: Form = "Great Tree";

const FormChoices: PickChoice<Form>[] = [
  { label: PrimalBeast, value: PrimalBeast },
  { label: GreatTree, value: GreatTree },
];

const PrimalBeastEffect = new Effect(
  PrimalBeast,
  "turnStart",
  (g) => {
    // TODO walking speed only
    g.events.on("GetSpeed", ({ detail: { who, bonus } }) => {
      if (who.hasEffect(PrimalBeastEffect)) bonus.add(10, PrimalBeastEffect);
    });

    // TODO darkvision 120

    g.events.on("BeforeAttack", ({ detail: { who, ability, diceType } }) => {
      if (who.hasEffect(PrimalBeastEffect) && ability === "str")
        diceType.add("advantage", PrimalBeastEffect);
    });

    g.events.on(
      "GatherDamage",
      ({ detail: { attacker, attack, interrupt, target, critical, map } }) => {
        if (
          attacker.hasEffect(PrimalBeastEffect) &&
          attack?.pre.tags.has("melee") &&
          attack.pre.tags.has("weapon")
        )
          interrupt.add(
            new EvaluateLater(attacker, PrimalBeastEffect, async () => {
              const amount = await g.rollDamage(
                1,
                {
                  source: PrimalBeastEffect,
                  attacker,
                  target,
                  size: 6,
                  damageType: "force",
                },
                critical,
              );
              map.add("radiant", amount);
            }),
          );
      },
    );
  },
  { tags: ["shapechange"] },
);

const GreatTreeEffect = new Effect(
  GreatTree,
  "turnStart",
  (g) => {
    g.events.on("BeforeSave", ({ detail: { who, ability, diceType } }) => {
      if (who.hasEffect(GreatTreeEffect) && ability === "con")
        diceType.add("advantage", GreatTreeEffect);
    });

    g.events.on("BeforeAttack", ({ detail: { who, ability, diceType } }) => {
      if (
        who.hasEffect(GreatTreeEffect) &&
        (ability === "dex" || ability === "wis")
      )
        diceType.add("advantage", GreatTreeEffect);
    });

    // TODO While you are on the ground, the ground within 15 feet of you is difficult terrain for your enemies.
  },
  { tags: ["shapechange"] },
);

const GuardianOfNature = simpleSpell<{ form: Form }>({
  status: "incomplete",
  name: "Guardian of Nature",
  level: 4,
  school: "Transmutation",
  concentration: true,
  time: "bonus action",
  v: true,
  lists: ["Druid", "Ranger"],

  getConfig: (g) => ({ form: new ChoiceResolver(g, FormChoices) }),
  getTargets: (g, caster) => [caster],

  async apply(g, caster, method, { form }) {
    const duration = minutes(1);
    let effect = PrimalBeastEffect;

    if (form === GreatTree) {
      effect = GreatTreeEffect;
      await g.giveTemporaryHP(caster, 10, GreatTreeEffect);
    }

    await caster.addEffect(effect, { duration });
    caster.concentrateOn({
      duration,
      spell: GuardianOfNature,
      async onSpellEnd() {
        await caster.removeEffect(effect);
      },
    });
  },
});
export default GuardianOfNature;
