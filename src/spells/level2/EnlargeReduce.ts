import { HasTarget } from "../../configs";
import Effect from "../../Effect";
import { Listener } from "../../events/Dispatcher";
import { canSee } from "../../filters";
import EvaluateLater from "../../interruptions/EvaluateLater";
import ChoiceResolver from "../../resolvers/ChoiceResolver";
import TargetResolver from "../../resolvers/TargetResolver";
import { atSet } from "../../types/AttackTag";
import Combatant from "../../types/Combatant";
import { EffectConfig } from "../../types/EffectType";
import Priority from "../../types/Priority";
import SizeCategory from "../../types/SizeCategory";
import { sieve } from "../../utils/array";
import { minutes } from "../../utils/time";
import { simpleSpell } from "../common";

const EnlargeEffect = new Effect(
  "Enlarge",
  "turnStart",
  (g) => {
    // Until the spell ends, the target also has advantage on Strength checks and Strength saving throws.
    const giveAdvantage: Listener<"BeforeCheck" | "BeforeSave"> = ({
      detail: { who, ability, diceType },
    }) => {
      if (who.hasEffect(EnlargeEffect) && ability === "str")
        diceType.add("advantage", EnlargeEffect);
    };
    g.events.on("BeforeCheck", giveAdvantage);
    g.events.on("BeforeSave", giveAdvantage);

    // The target's weapons also grow to match its new size. While these weapons are enlarged, the target's attacks with them deal 1d4 extra damage.
    g.events.on(
      "GatherDamage",
      ({ detail: { attacker, weapon, interrupt, critical, bonus } }) => {
        if (attacker?.hasEffect(EnlargeEffect) && weapon)
          interrupt.add(
            new EvaluateLater(
              attacker,
              EnlargeEffect,
              Priority.Normal,
              async () => {
                const amount = await g.rollDamage(
                  1,
                  {
                    source: EnlargeEffect,
                    attacker,
                    size: 4,
                    tags: atSet("magical"),
                  },
                  critical,
                );
                bonus.add(amount, EnlargeEffect);
              },
            ),
          );
      },
    );
  },
  { tags: ["magic"] },
);

const ReduceEffect = new Effect(
  "Reduce",
  "turnStart",
  (g) => {
    // Until the spell ends, the target also has disadvantage on Strength checks and Strength saving throws.
    const giveDisadvantage: Listener<"BeforeCheck" | "BeforeSave"> = ({
      detail: { who, ability, diceType },
    }) => {
      if (who.hasEffect(ReduceEffect) && ability === "str")
        diceType.add("disadvantage", ReduceEffect);
    };
    g.events.on("BeforeCheck", giveDisadvantage);
    g.events.on("BeforeSave", giveDisadvantage);

    // The target's weapons also shrink to match its new size. While these weapons are reduced, the target's attacks with them deal 1d4 less damage.
    // TODO (this can't reduce the damage below 1)
    g.events.on(
      "GatherDamage",
      ({ detail: { attacker, weapon, interrupt, critical, bonus } }) => {
        if (attacker?.hasEffect(ReduceEffect) && weapon)
          interrupt.add(
            new EvaluateLater(
              attacker,
              ReduceEffect,
              Priority.Normal,
              async () => {
                const amount = await g.rollDamage(
                  1,
                  {
                    source: ReduceEffect,
                    attacker,
                    size: 4,
                    tags: atSet("magical"),
                  },
                  critical,
                );
                bonus.add(-amount, ReduceEffect);
              },
            ),
          );
      },
    );
  },
  { tags: ["magic"] },
);

function applySizeChange(size: SizeCategory, change: number) {
  const newCategory = size + change;
  if (SizeCategory[newCategory]) return newCategory as SizeCategory;

  return undefined;
}

class EnlargeReduceController {
  applied: boolean;

  constructor(
    public caster: Combatant,
    public effect: Effect,
    public config: EffectConfig,
    public target: Combatant,
    public sizeChange = effect === EnlargeEffect ? 1 : -1,
  ) {
    this.applied = false;
  }

  async apply() {
    const { effect, config, target, sizeChange } = this;
    if (!(await target.addEffect(effect, config))) return;

    const newSize = applySizeChange(target.size, sizeChange);
    if (newSize) {
      this.applied = true;
      target.size = newSize;
    }

    this.caster.concentrateOn({
      duration: config.duration,
      spell: EnlargeReduce,
      onSpellEnd: this.remove.bind(this),
    });
  }

  async remove() {
    if (this.applied) {
      const oldSize = applySizeChange(this.target.size, -this.sizeChange);
      if (oldSize) this.target.size = oldSize;
    }

    await this.target.removeEffect(this.effect);
  }
}

type Config = HasTarget & { mode: "enlarge" | "reduce" };

const EnlargeReduce = simpleSpell<Config>({
  status: "implemented",
  name: "Enlarge/Reduce",
  level: 2,
  school: "Transmutation",
  concentration: true,
  v: true,
  s: true,
  m: "a pinch of powdered iron",
  lists: ["Artificer", "Sorcerer", "Wizard"],
  isHarmful: true, // TODO could be either
  description: `You cause a creature or an object you can see within range to grow larger or smaller for the duration. Choose either a creature or an object that is neither worn nor carried. If the target is unwilling, it can make a Constitution saving throw. On a success, the spell has no effect.

  If the target is a creature, everything it is wearing and carrying changes size with it. Any item dropped by an affected creature returns to normal size at once.

  - Enlarge. The target's size doubles in all dimensions, and its weight is multiplied by eight. This growth increases its size by one category—from Medium to Large, for example. If there isn't enough room for the target to double its size, the creature or object attains the maximum possible size in the space available. Until the spell ends, the target also has advantage on Strength checks and Strength saving throws. The target's weapons also grow to match its new size. While these weapons are enlarged, the target's attacks with them deal 1d4 extra damage.
  - Reduce. The target's size is halved in all dimensions, and its weight is reduced to one-eighth of normal. This reduction decreases its size by one category—from Medium to Small, for example. Until the spell ends, the target also has disadvantage on Strength checks and Strength saving throws. The target's weapons also shrink to match its new size. While these weapons are reduced, the target's attacks with them deal 1d4 less damage (this can't reduce the damage below 1).`,

  getConfig: (g) => ({
    target: new TargetResolver(g, 30, [canSee]),
    mode: new ChoiceResolver(g, [
      { label: "enlarge", value: "enlarge" },
      { label: "reduce", value: "reduce" },
    ]),
  }),
  getTargets: (g, caster, { target }) => sieve(target),
  getAffected: (g, caster, { target }) => [target],

  async apply({ g, caster, method }, { mode, target }) {
    const effect = mode === "enlarge" ? EnlargeEffect : ReduceEffect;
    const config = { duration: minutes(1) };

    if (target.side !== caster.side) {
      // TODO technically this should be a choice

      const { outcome } = await g.save({
        source: EnlargeReduce,
        type: method.getSaveType(caster, EnlargeReduce),
        attacker: caster,
        who: target,
        ability: "con",
        spell: EnlargeReduce,
        method,
        effect,
        config,
        tags: ["magic"],
      });
      if (outcome === "success") return;
    }

    const controller = new EnlargeReduceController(
      caster,
      effect,
      config,
      target,
    );
    await controller.apply();
  },
});
export default EnlargeReduce;
