import Effect from "../../Effect";
import EvaluateLater from "../../interruptions/EvaluateLater";
import { PickChoice } from "../../interruptions/PickFromListChoice";
import ChoiceResolver from "../../resolvers/ChoiceResolver";
import { atSet } from "../../types/AttackTag";
import { minutes } from "../../utils/time";
import { distanceTo } from "../../utils/units";
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
    // Your walking speed increases by 10 feet.
    // TODO walking speed only
    g.events.on("GetSpeed", ({ detail: { who, bonus } }) => {
      if (who.hasEffect(PrimalBeastEffect)) bonus.add(10, PrimalBeastEffect);
    });

    // TODO You gain darkvision with a range of 120 feet.

    // You make Strength-based attack rolls with advantage.
    g.events.on("BeforeAttack", ({ detail: { who, ability, diceType } }) => {
      if (who.hasEffect(PrimalBeastEffect) && ability === "str")
        diceType.add("advantage", PrimalBeastEffect);
    });

    // Your melee weapon attacks deal an extra 1d6 force damage on a hit.
    g.events.on(
      "GatherDamage",
      ({ detail: { attacker, attack, interrupt, target, critical, map } }) => {
        if (
          attacker?.hasEffect(PrimalBeastEffect) &&
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
                  tags: atSet("magical"),
                },
                critical,
              );
              map.add("radiant", amount);
            }),
          );
      },
    );
  },
  { tags: ["magic", "shapechange"] },
);

const GreatTreeEffect = new Effect(
  GreatTree,
  "turnStart",
  (g) => {
    // You make Constitution saving throws with advantage.
    g.events.on("BeforeSave", ({ detail: { who, ability, diceType } }) => {
      if (who.hasEffect(GreatTreeEffect) && ability === "con")
        diceType.add("advantage", GreatTreeEffect);
    });

    // You make Dexterity- and Wisdom-based attack rolls with advantage.
    g.events.on("BeforeAttack", ({ detail: { who, ability, diceType } }) => {
      if (
        who.hasEffect(GreatTreeEffect) &&
        (ability === "dex" || ability === "wis")
      )
        diceType.add("advantage", GreatTreeEffect);
    });

    // While you are on the ground, the ground within 15 feet of you is difficult terrain for your enemies.
    g.events.on("GetTerrain", ({ detail: { who, where, difficult } }) => {
      const trees = Array.from(g.combatants).filter((other) =>
        other.hasEffect(GreatTreeEffect),
      );

      for (const tree of trees) {
        // TODO While you are on the ground...
        if (who.side !== tree.side && distanceTo(tree, where) <= 15)
          difficult.add("magical plants", GreatTreeEffect);
      }
    });
  },
  { tags: ["magic", "shapechange"] },
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
  description: `A nature spirit answers your call and transforms you into a powerful guardian. The transformation lasts until the spell ends. You choose one of the following forms to assume: Primal Beast or Great Tree.

  Primal Beast. Bestial fur covers your body, your facial features become feral, and you gain the following benefits:
  - Your walking speed increases by 10 feet.
  - You gain darkvision with a range of 120 feet.
  - You make Strength-based attack rolls with advantage.
  - Your melee weapon attacks deal an extra 1d6 force damage on a hit.

  Great Tree. Your skin appears barky, leaves sprout from your hair, and you gain the following benefits:
  - You gain 10 temporary hit points.
  - You make Constitution saving throws with advantage.
  - You make Dexterity- and Wisdom-based attack rolls with advantage.
  - While you are on the ground, the ground within 15 feet of you is difficult terrain for your enemies.`,

  getConfig: (g) => ({ form: new ChoiceResolver(g, FormChoices) }),
  getTargets: () => [],
  getAffected: (g, caster) => [caster],

  async apply(g, caster, method, { form }) {
    const duration = minutes(1);
    let effect = PrimalBeastEffect;

    // You gain 10 temporary hit points.
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
