import ErrorCollector from "../collectors/ErrorCollector";
import { Grappled } from "../effects";
import Engine from "../Engine";
import ChoiceResolver from "../resolvers/ChoiceResolver";
import { chSet } from "../types/CheckTag";
import Combatant from "../types/Combatant";
import { sieve } from "../utils/array";
import AbstractAction from "./AbstractAction";
import { GrappleChoice, GrappleChoices } from "./common";

type Config = { choice: GrappleChoice };

export default class EscapeGrappleAction extends AbstractAction<Config> {
  constructor(g: Engine, actor: Combatant) {
    super(
      g,
      actor,
      "Escape a Grapple",
      "implemented",
      { choice: new ChoiceResolver(g, GrappleChoices) },
      {
        description: `A grappled creature can use its action to escape. To do so, it must succeed on a Strength (Athletics) or Dexterity (Acrobatics) check contested by your Strength (Athletics) check.`,
        tags: ["escape move prevention"],
        time: "action",
      },
    );
  }

  getAffected() {
    return [this.actor, this.actor.getEffectConfig(Grappled)!.by];
  }
  getTargets() {
    return sieve(this.actor.getEffectConfig(Grappled)?.by);
  }

  check(config: Config, ec: ErrorCollector) {
    if (!this.actor.hasEffect(Grappled)) ec.add("not being grappled", this);
    return super.check(config, ec);
  }

  async apply(config: Config) {
    await super.apply(config);
    const { ability, skill } = config.choice;
    const { g, actor } = this;

    const grapple = actor.getEffectConfig(Grappled);
    if (!grapple) throw new Error("Trying to escape a non-existent grapple");
    const { by: grappler } = grapple;

    const { total: mine } = await g.abilityCheck(NaN, {
      ability,
      skill,
      who: actor,
      attacker: grappler,
      tags: chSet("grapple"),
    });

    const { total: theirs } = await g.abilityCheck(NaN, {
      ability: "str",
      skill: "Athletics",
      who: grappler,
      attacker: actor,
      tags: chSet("grapple"),
    });

    if (mine > theirs) await actor.removeEffect(Grappled);
  }
}
