import bashUrl from "@img/act/shield-bash.svg";
import tokenUrl from "@img/tok/boss/o-gonrit.png";

import AbstractAction from "../../actions/AbstractAction";
import { HealAllies } from "../../ai/coefficients";
import DamageRule from "../../ai/DamageRule";
import HealingRule from "../../ai/HealingRule";
import StayNearAlliesRule from "../../ai/StayNearAlliesRule";
import { makeIcon } from "../../colours";
import { HasTarget } from "../../configs";
import Effect from "../../Effect";
import Engine from "../../Engine";
import { bonusSpellsFeature } from "../../features/common";
import FightingStyleProtection from "../../features/fightingStyles/Protection";
import SimpleFeature from "../../features/SimpleFeature";
import { isEnemy } from "../../filters";
import EvaluateLater from "../../interruptions/EvaluateLater";
import { Shield, SplintArmor } from "../../items/armor";
import { Mace } from "../../items/weapons";
import Monster from "../../Monster";
import TargetResolver from "../../resolvers/TargetResolver";
import InnateSpellcasting from "../../spells/InnateSpellcasting";
import GuidingBolt from "../../spells/level1/GuidingBolt";
import MassHealingWord from "../../spells/level3/MassHealingWord";
import AbilityName from "../../types/AbilityName";
import { atSet } from "../../types/AttackTag";
import Combatant from "../../types/Combatant";
import { coSet } from "../../types/ConditionName";
import Priority from "../../types/Priority";
import SizeCategory from "../../types/SizeCategory";
import { sieve } from "../../utils/array";
import { distance } from "../../utils/units";
import { FiendishParty } from "./common";

const FiendishMantleRange = 30;
const FiendishMantle = new SimpleFeature(
  "Fiendish Mantle",
  "As long as he is conscious, whenever any ally within 30 ft. of O Gonrit deals damage with a weapon attack, they deal an extra 2 (1d4) necrotic damage.",
  (g, me) => {
    g.events.on(
      "GatherDamage",
      ({ detail: { attacker, attack, critical, interrupt, map } }) => {
        if (
          !me.conditions.has("Unconscious") &&
          attacker?.side === me.side &&
          attacker !== me &&
          attack?.pre.tags.has("weapon") &&
          distance(me, attacker) <= FiendishMantleRange
        )
          interrupt.add(
            new EvaluateLater(
              attacker,
              FiendishMantle,
              Priority.Normal,
              async () => {
                const amount = await g.rollDamage(
                  1,
                  {
                    attacker,
                    source: FiendishMantle,
                    damageType: "necrotic",
                    size: 4,
                    tags: atSet("magical"),
                  },
                  critical,
                );
                map.add("necrotic", amount);
              },
            ),
          );
      },
    );
  },
);

const ShieldBashIcon = makeIcon(bashUrl);

const ShieldBashEffect = new Effect(
  "Shield Bash",
  "turnEnd",
  (g) => {
    g.events.on("GetConditions", ({ detail: { who, conditions } }) => {
      if (who.hasEffect(ShieldBashEffect))
        conditions.add("Stunned", ShieldBashEffect);
    });
  },
  { icon: ShieldBashIcon },
);

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
      { target: new TargetResolver(g, actor.reach, [isEnemy]) },
      { icon: ShieldBashIcon, time: "action", tags: ["harmful"] },
    );
  }

  getAffected({ target }: HasTarget) {
    return [target];
  }
  getTargets({ target }: Partial<HasTarget>) {
    return sieve(target);
  }

  async apply({ target }: HasTarget) {
    await super.apply({ target });

    const { g, actor, ability } = this;
    const config = { conditions: coSet("Stunned"), duration: 1 };
    const { outcome } = await g.save({
      source: this,
      type: { type: "ability", ability },
      attacker: actor,
      who: target,
      ability: "con",
      effect: ShieldBashEffect,
      config,
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
    super(g, "O Gonrit", 5, "fiend", SizeCategory.Medium, tokenUrl, 65, [
      new HealingRule(),
      new DamageRule(),
      new StayNearAlliesRule(FiendishMantleRange),
    ]);
    this.coefficients.set(HealAllies, 1.2);
    this.groups.add(FiendishParty);
    this.diesAtZero = false;
    this.movement.set("speed", 30);
    this.setAbilityScores(15, 8, 14, 10, 18, 13);
    this.pb = 3;
    this.level = 5; // for spellcasting

    this.saveProficiencies.add("wis");
    this.saveProficiencies.add("cha");
    this.addProficiency("Insight", "proficient");
    this.addProficiency("Persuasion", "proficient");
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
