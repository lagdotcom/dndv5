import { AbstractSingleTargetAction } from "../../actions/AbstractAction";
import { HasPoint, HasTarget } from "../../configs";
import Effect from "../../Effect";
import { Prone } from "../../effects";
import Engine from "../../Engine";
import { hasEffect } from "../../filters";
import EvaluateLater from "../../interruptions/EvaluateLater";
import MessageBuilder from "../../MessageBuilder";
import PointResolver from "../../resolvers/PointResolver";
import TargetResolver from "../../resolvers/TargetResolver";
import Combatant from "../../types/Combatant";
import { coSet } from "../../types/ConditionName";
import { SpecifiedSphere } from "../../types/EffectArea";
import Point from "../../types/Point";
import Priority from "../../types/Priority";
import { minutes } from "../../utils/time";
import { distance } from "../../utils/units";
import { scalingSpell } from "../common";

class SlapAction extends AbstractSingleTargetAction {
  constructor(g: Engine, actor: Combatant) {
    super(
      g,
      actor,
      "Shake/Slap Awake",
      "implemented",
      {
        target: new TargetResolver(g, actor.reach, [
          hasEffect(SleepEffect, "sleeping", "not sleeping"),
        ]),
      },
      {
        description: `Shaking or slapping the sleeper will awaken them.`,
        time: "action",
      },
    );
  }

  async applyEffect({ target }: HasTarget) {
    await target.removeEffect(SleepEffect);
  }
}

const SleepEffect = new Effect(
  "Sleep",
  "turnStart",
  (g) => {
    g.events.on("GetConditions", ({ detail: { who, conditions } }) => {
      if (who.hasEffect(SleepEffect))
        conditions.add("Unconscious", SleepEffect);
    });

    g.events.on("CombatantDamaged", ({ detail: { who, interrupt } }) => {
      if (who.hasEffect(SleepEffect))
        interrupt.add(
          new EvaluateLater(who, SleepEffect, Priority.Normal, () =>
            who.removeEffect(SleepEffect),
          ),
        );
    });

    g.events.on("GetActions", ({ detail: { who, actions } }) => {
      for (const target of g.combatants) {
        if (!target.hasEffect(SleepEffect)) continue;
        if (distance(who, target) <= 5) {
          actions.push(new SlapAction(g, who));
          return;
        }
      }
    });
  },
  { tags: ["magic", "sleep"] },
);

const getSleepArea = (centre: Point): SpecifiedSphere => ({
  type: "sphere",
  centre,
  radius: 20,
});

const Sleep = scalingSpell<HasPoint>({
  status: "implemented",
  name: "Sleep",
  level: 1,
  school: "Enchantment",
  v: true,
  s: true,
  m: "a pinch of fine sand, rose petals, or a cricket",
  lists: ["Bard", "Sorcerer", "Wizard"],
  description: `This spell sends creatures into a magical slumber. Roll 5d8; the total is how many hit points of creatures this spell can affect. Creatures within 20 feet of a point you choose within range are affected in ascending order of their current hit points (ignoring unconscious creatures).

  Starting with the creature that has the lowest current hit points, each creature affected by this spell falls unconscious until the spell ends, the sleeper takes damage, or someone uses an action to shake or slap the sleeper awake. Subtract each creature's hit points from the total before moving on to the creature with the next lowest hit points. A creature's hit points must be equal to or less than the remaining total for that creature to be affected.
  
  Undead and creatures immune to being charmed aren't affected by this spell.
  
  At Higher Levels. When you cast this spell using a spell slot of 2nd level or higher, roll an additional 2d8 for each slot level above 1st.`,
  isHarmful: true,

  getConfig: (g) => ({ point: new PointResolver(g, 90) }),
  getAffectedArea: (g, caster, { point }) => point && [getSleepArea(point)],
  getTargets: () => [],
  getAffected: (g, caster, { point }) =>
    g
      .getInside(getSleepArea(point))
      .filter((co) => !co.conditions.has("Unconscious")),

  async apply({ g, caster }, { slot, point }) {
    const dice = 3 + slot * 2;
    let affectedHp = await g.rollMany(dice, {
      type: "other",
      source: Sleep,
      who: caster,
      size: 8,
    });

    const affected = g
      .getInside(getSleepArea(point))
      .filter((co) => !co.conditions.has("Unconscious"))
      .sort((a, b) => a.hp - b.hp);
    for (const target of affected) {
      if (target.hp > affectedHp) return;

      if (target.type === "undead") {
        g.text(
          new MessageBuilder().co(target).text(" is immune to sleep effects."),
        );
        continue;
      }

      affectedHp -= target.hp;

      const success = await target.addEffect(
        SleepEffect,
        { conditions: coSet("Charmed", "Unconscious"), duration: minutes(1) },
        caster,
      );
      if (success)
        await target.addEffect(Prone, { duration: Infinity }, caster);
    }
  },
});
export default Sleep;
