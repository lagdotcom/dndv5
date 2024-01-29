import AbstractAction from "../actions/AbstractAction";
import { HasTarget } from "../configs";
import Engine from "../Engine";
import ConfiguredFeature from "../features/ConfiguredFeature";
import { canSee } from "../filters";
import { makeStringChoice } from "../interruptions/PickFromListChoice";
import MessageBuilder from "../MessageBuilder";
import ChoiceResolver from "../resolvers/ChoiceResolver";
import TargetResolver from "../resolvers/TargetResolver";
import AbilityName from "../types/AbilityName";
import Combatant from "../types/Combatant";
import { sieve } from "../utils/array";
import { implementationWarning } from "../utils/env";

type TelekineticShoveType = "toward" | "away";
const telekineticShoveChoices = [
  makeStringChoice<TelekineticShoveType>("toward"),
  makeStringChoice<TelekineticShoveType>("away"),
];

type Config = HasTarget & { type: TelekineticShoveType };

class TelekineticShove extends AbstractAction<Config> {
  constructor(
    g: Engine,
    actor: Combatant,
    private ability: AbilityName,
  ) {
    super(
      g,
      actor,
      "Telekinetic Shove",
      "incomplete",
      {
        target: new TargetResolver(g, 30, [canSee]),
        type: new ChoiceResolver(g, telekineticShoveChoices),
      },
      {
        description: `As a bonus action, you can try to telekinetically shove one creature you can see within 30 feet of you. When you do so, the target must succeed on a Strength saving throw (DC 8 + your proficiency bonus + the ability modifier of the score increased by this feat) or be moved 5 feet toward you or away from you. A creature can willingly fail this save.`,
        time: "bonus action",
      },
    );
  }

  getTargets({ target }: Partial<Config>) {
    return sieve(target);
  }
  getAffected({ target }: Config) {
    return [target];
  }

  async applyEffect({ target, type }: Config) {
    const { g, ability, actor } = this;

    // TODO A creature can willingly fail this save.
    const { outcome } = await g.save({
      source: this,
      type: { type: "ability", ability },
      ability: "str",
      attacker: actor,
      save: "zero",
      tags: ["forced movement"],
      who: target,
    });
    if (outcome === "fail") {
      g.text(
        new MessageBuilder()
          .co(actor)
          .text(" telekinetically shoves ")
          .sp()
          .co(target)
          .text(type === "toward" ? " toward them." : " away from them."),
      );
      await g.forcePush(target, actor, 5, this, type === "toward");
    }
  }
}

const Telekinetic = new ConfiguredFeature<"int" | "wis" | "cha">(
  "Telekinetic",
  `You learn to move things with your mind, granting you the following benefits:
- Increase your Intelligence, Wisdom, or Charisma by 1, to a maximum of 20.
- You learn the mage hand cantrip. You can cast it without verbal or somatic components, and you can make the spectral hand invisible. If you already know this spell, its range increases by 30 feet when you cast it. Its spellcasting ability is the ability increased by this feat.
- As a bonus action, you can try to telekinetically shove one creature you can see within 30 feet of you. When you do so, the target must succeed on a Strength saving throw (DC 8 + your proficiency bonus + the ability modifier of the score increased by this feat) or be moved 5 feet toward you or away from you. A creature can willingly fail this save.`,
  (g, me, ability) => {
    me[ability].score++;

    // TODO You learn the mage hand cantrip. You can cast it without verbal or somatic components, and you can make the spectral hand invisible. If you already know this spell, its range increases by 30 feet when you cast it. Its spellcasting ability is the ability increased by this feat.
    implementationWarning("Feat", "Not Complete", Telekinetic.name, me.name);

    g.events.on("GetActions", ({ detail: { who, actions } }) => {
      if (who === me) actions.push(new TelekineticShove(g, me, ability));
    });
  },
);
export default Telekinetic;
