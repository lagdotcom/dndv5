import ErrorCollector from "../collectors/ErrorCollector";
import { HasTarget } from "../configs";
import { Grappled } from "../effects";
import Engine from "../Engine";
import { ErrorFilter, sizeOrLess } from "../filters";
import PickFromListChoice from "../interruptions/PickFromListChoice";
import TargetResolver from "../resolvers/TargetResolver";
import { chSet } from "../types/CheckTag";
import Combatant from "../types/Combatant";
import Priority from "../types/Priority";
import { sieve } from "../utils/array";
import AbstractAttackAction from "./AbstractAttackAction";
import { GrappleChoices } from "./common";

const isNotGrappling = (who: Combatant): ErrorFilter<Combatant> => ({
  name: "not grappling",
  message: "already grappling",
  check: (g, action, value) => !who.grappling.has(value),
});

export default class GrappleAction extends AbstractAttackAction<HasTarget> {
  constructor(g: Engine, actor: Combatant) {
    super(
      g,
      actor,
      "Grapple",
      "implemented",
      "grapple",
      "melee",
      {
        target: new TargetResolver(g, actor.reach, [
          sizeOrLess(actor.size + 1),
          isNotGrappling(actor),
        ]),
      },
      {
        description: `When you want to grab a creature or wrestle with it, you can use the Attack action to make a special melee attack, a grapple. If you're able to make multiple attacks with the Attack action, this attack replaces one of them. The target of your grapple must be no more than one size larger than you, and it must be within your reach.

    Using at least one free hand, you try to seize the target by making a grapple check, a Strength (Athletics) check contested by the target's Strength (Athletics) or Dexterity (Acrobatics) check (the target chooses the ability to use). You succeed automatically if the target is incapacitated. If you succeed, you subject the target to the grappled condition (see the appendix). The condition specifies the things that end it, and you can release the target whenever you like (no action required).`,
      },
    );
  }

  getTargets({ target }: Partial<HasTarget>) {
    return sieve(target);
  }
  getAffected({ target }: HasTarget) {
    return [target];
  }

  check(config: Partial<HasTarget>, ec: ErrorCollector) {
    if (this.actor.freeHands < 1) ec.add("no free hands", this);
    return super.check(config, ec);
  }

  async apply({ target }: HasTarget) {
    await super.apply({ target });

    const { actor, g } = this;

    if (target.conditions.has("Incapacitated")) {
      await this.applyGrapple(target);
      return;
    }

    // TODO make a contest function?
    const { total: mine } = await g.abilityCheck(NaN, {
      ability: "str",
      skill: "Athletics",
      who: actor,
      attacker: target,
      tags: chSet("grapple"),
    });

    await new PickFromListChoice(
      target,
      this,
      "Grapple",
      `${actor.name} is trying to grapple ${target.name}. Contest with which skill?`,
      Priority.Normal,
      GrappleChoices,
      async ({ ability, skill }) => {
        const { total: theirs } = await g.abilityCheck(NaN, {
          ability,
          skill,
          who: target,
          attacker: actor,
          tags: chSet("grapple"),
        });

        if (mine > theirs) await this.applyGrapple(target);
      },
    ).apply(g);
  }

  // TODO [HANDS]
  async applyGrapple(target: Combatant) {
    await target.addEffect(
      Grappled,
      { duration: Infinity, by: this.actor },
      this.actor,
    );
  }
}
