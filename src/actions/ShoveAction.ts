import { HasTarget } from "../configs";
import { Prone } from "../effects";
import Engine from "../Engine";
import { sizeOrLess } from "../filters";
import PickFromListChoice, {
  makeChoice,
} from "../interruptions/PickFromListChoice";
import ChoiceResolver from "../resolvers/ChoiceResolver";
import TargetResolver from "../resolvers/TargetResolver";
import { chSet } from "../types/CheckTag";
import Combatant from "../types/Combatant";
import Priority from "../types/Priority";
import { sieve } from "../utils/array";
import AbstractAttackAction from "./AbstractAttackAction";
import { GrappleChoices } from "./common";

type ShoveType = "prone" | "push";

type Config = HasTarget & { type: ShoveType };

const shoveTypeChoices = [
  makeChoice<ShoveType>("prone", "knock prone"),
  makeChoice<ShoveType>("push", "push 5 feet away"),
];

export default class ShoveAction extends AbstractAttackAction<Config> {
  constructor(g: Engine, actor: Combatant) {
    super(
      g,
      actor,
      "Shove",
      "implemented",
      "shove",
      "melee",
      {
        target: new TargetResolver(g, actor.reach, [
          sizeOrLess(actor.size + 1),
        ]),
        type: new ChoiceResolver(g, shoveTypeChoices),
      },
      {
        description: `Using the Attack action, you can make a special melee attack to shove a creature, either to knock it prone or push it away from you. If you're able to make multiple attacks with the Attack action, this attack replaces one of them.

    The target of your shove must be no more than one size larger than you, and it must be within your reach. You make a Strength (Athletics) check contested by the target's Strength (Athletics) or Dexterity (Acrobatics) check (the target chooses the ability to use). You succeed automatically if the target is incapacitated. If you succeed, you either knock the target prone or push it 5 feet away from you.`,
      },
    );
  }

  getAffected({ target }: Config) {
    return [target];
  }
  getTargets({ target }: Partial<Config>) {
    return sieve(target);
  }

  async apply(config: Config) {
    await super.apply(config);

    const { target, type } = config;
    const { g, actor } = this;

    if (target.conditions.has("Incapacitated")) {
      await this.applyShove(target, type);
      return;
    }

    // TODO make a contest function?
    const { total: mine } = await g.abilityCheck(NaN, {
      ability: "str",
      skill: "Athletics",
      who: actor,
      attacker: target,
      tags: chSet("shove"),
    });

    await new PickFromListChoice(
      target,
      this,
      "Grapple",
      `${actor.name} is trying to shove ${target.name}. Contest with which skill?`,
      Priority.Normal,
      GrappleChoices,
      async ({ ability, skill }) => {
        const { total: theirs } = await g.abilityCheck(NaN, {
          ability,
          skill,
          who: target,
          attacker: actor,
          tags: chSet("shove"),
        });

        if (mine > theirs) await this.applyShove(target, type);
      },
    ).apply(g);
  }

  async applyShove(target: Combatant, type: ShoveType) {
    if (type === "prone")
      await target.addEffect(Prone, { duration: Infinity }, this.actor);
    else await this.g.forcePush(target, this.actor, 5, this);
  }
}
