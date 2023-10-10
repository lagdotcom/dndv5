import AbstractAction from "../../actions/AbstractAction";
import { HasTarget } from "../../configs";
import Effect from "../../Effect";
import Engine from "../../Engine";
import { bonusSpellsFeature } from "../../features/common";
import { FightingStyleProtection } from "../../features/fightingStyles";
import SimpleFeature from "../../features/SimpleFeature";
import EvaluateLater from "../../interruptions/EvaluateLater";
import { Shield, SplintArmor } from "../../items/armor";
import { Mace } from "../../items/weapons";
import Monster from "../../Monster";
import TargetResolver from "../../resolvers/TargetResolver";
import InnateSpellcasting from "../../spells/InnateSpellcasting";
import GuidingBolt from "../../spells/level1/GuidingBolt";
import MassHealingWord from "../../spells/level3/MassHealingWord";
import AbilityName from "../../types/AbilityName";
import Combatant from "../../types/Combatant";
import { coSet } from "../../types/ConditionName";
import { svSet } from "../../types/SaveTag";
import { getSaveDC } from "../../utils/dnd";
import { distance } from "../../utils/units";
import tokenUrl from "./OGonrit_token.png";

const FiendishMantle = new SimpleFeature(
  "Fiendish Mantle",
  "Whenever any ally within 30 ft. of O Gonrit deals damage with a weapon attack, they deal an extra 2 (1d4) necrotic damage.",
  (g, me) => {
    g.events.on(
      "GatherDamage",
      ({ detail: { attacker, attack, critical, interrupt, map } }) => {
        if (
          attacker.side === me.side &&
          attacker !== me &&
          attack?.pre.tags.has("weapon") &&
          distance(g, me, attacker) <= 30
        )
          interrupt.add(
            new EvaluateLater(attacker, FiendishMantle, async () => {
              const amount = await g.rollDamage(
                1,
                {
                  attacker,
                  source: FiendishMantle,
                  damageType: "necrotic",
                  size: 4,
                },
                critical,
              );
              map.add("necrotic", amount);
            }),
          );
      },
    );
  },
);

const ShieldBashEffect = new Effect("Shield Bash", "turnEnd", (g) => {
  g.events.on("GetConditions", ({ detail: { who, conditions } }) => {
    if (who.hasEffect(ShieldBashEffect))
      conditions.add("Stunned", ShieldBashEffect);
  });
});

class ShieldBashAction extends AbstractAction<HasTarget> {
  constructor(
    g: Engine,
    actor: Combatant,
    private ability: AbilityName,
  ) {
    super(
      g,
      actor,
      "Shield Bash",
      "implemented",
      { target: new TargetResolver(g, actor.reach) },
      { time: "action" },
    );
  }

  async apply({ target }: HasTarget) {
    await super.apply({ target });

    const { g, actor, ability } = this;
    const dc = getSaveDC(actor, ability);
    const config = { conditions: coSet("Stunned"), duration: 1 };
    const { outcome } = await g.savingThrow(dc, {
      ability: "con",
      attacker: actor,
      effect: ShieldBashEffect,
      config,
      who: target,
      tags: svSet(),
    });

    if (outcome === "fail")
      await target.addEffect(ShieldBashEffect, config, actor);
  }
}

const ShieldBash = new SimpleFeature(
  "Shield Bash",
  "One enemy within 5 ft. must succeed on a DC 15 Constitution save or be stunned until the end of their next turn.",
  (g, me) => {
    g.events.on("GetActions", ({ detail: { who, actions } }) => {
      if (who === me) actions.push(new ShieldBashAction(g, me, "wis"));
    });
  },
);

const SpellcastingMethod = new InnateSpellcasting(
  "Spellcasting",
  "wis",
  () => undefined,
);
const Spellcasting = bonusSpellsFeature(
  "Spellcasting",
  "O Gonrit can cast guiding bolt and mass healing word at will.",
  "level",
  SpellcastingMethod,
  [
    { level: 1, spell: GuidingBolt },
    { level: 5, spell: MassHealingWord },
  ],
);

export default class OGonrit extends Monster {
  constructor(g: Engine) {
    super(g, "O Gonrit", 5, "fiend", "medium", tokenUrl, 65);
    this.diesAtZero = false;
    this.movement.set("speed", 30);
    this.setAbilityScores(12, 8, 14, 10, 18, 13);
    this.pb = 3;
    this.level = 5; // for spellcasting

    this.saveProficiencies.add("wis");
    this.saveProficiencies.add("cha");
    this.skills.set("Insight", 1);
    this.skills.set("Persuasion", 1);
    this.damageResponses.set("fire", "resist");
    this.damageResponses.set("poison", "resist");
    this.conditionImmunities.add("Poisoned");
    this.languages.add("Abyssal");
    this.languages.add("Common");

    this.addFeature(FiendishMantle);
    this.addFeature(ShieldBash);
    this.addFeature(Spellcasting);
    this.addFeature(FightingStyleProtection);

    this.don(new SplintArmor(g), true);
    this.don(new Shield(g), true);
    this.don(new Mace(g), true);
  }
}
