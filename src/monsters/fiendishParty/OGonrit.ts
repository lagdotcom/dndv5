import bashUrl from "@img/act/shield-bash.svg";
import tokenUrl from "@img/tok/boss/o-gonrit.png";

import AbstractAction from "../../actions/AbstractAction";
import { HealAllies } from "../../ai/coefficients";
import DamageRule from "../../ai/DamageRule";
import HealingRule from "../../ai/HealingRule";
import StayNearAlliesRule from "../../ai/StayNearAlliesRule";
import AuraController from "../../AuraController";
import { makeIcon } from "../../colours";
import { HasTarget } from "../../configs";
import MonsterTemplate from "../../data/MonsterTemplate";
import Effect from "../../Effect";
import Engine from "../../Engine";
import { bonusSpellsFeature } from "../../features/common";
import FightingStyleProtection from "../../features/fightingStyles/Protection";
import SimpleFeature from "../../features/SimpleFeature";
import { isEnemy } from "../../filters";
import EvaluateLater from "../../interruptions/EvaluateLater";
import TargetResolver from "../../resolvers/TargetResolver";
import InnateSpellcasting from "../../spells/InnateSpellcasting";
import AbilityName from "../../types/AbilityName";
import { atSet } from "../../types/AttackTag";
import Combatant from "../../types/Combatant";
import { coSet } from "../../types/ConditionName";
import Priority from "../../types/Priority";
import { sieve } from "../../utils/array";
import { FiendishParty } from "./common";

const FiendishMantleRange = 30;
const FiendishMantle = new SimpleFeature(
  "Fiendish Mantle",
  `As long as he is conscious, whenever any ally within ${FiendishMantleRange} ft. of O Gonrit deals damage with a weapon attack, they deal an extra 2 (1d4) necrotic damage.`,
  (g, me) => {
    const aura = new AuraController(
      g,
      "Fiendish Mantle",
      me,
      FiendishMantleRange,
      ["profane"],
      "purple",
    ).setActiveChecker((who) => !who.conditions.has("Unconscious"));

    g.events.on(
      "GatherDamage",
      ({ detail: { attacker, attack, critical, interrupt, map } }) => {
        if (
          attacker?.side === me.side &&
          attacker !== me &&
          attack?.roll.type.tags.has("weapon") &&
          aura.isAffecting(attacker)
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

const SpellcastingMethod = new InnateSpellcasting("Spellcasting", "wis");
const Spellcasting = bonusSpellsFeature(
  "Spellcasting",
  "O Gonrit can cast guiding bolt and mass healing word at will.",
  "level",
  SpellcastingMethod,
  [
    { level: 1, spell: "guiding bolt" },
    { level: 5, spell: "mass healing word" },
  ],
);

const OGonrit: MonsterTemplate = {
  name: "O Gonrit",
  cr: 5,
  type: "fiend",
  tokenUrl,
  hpMax: 65,
  aiRules: [
    new HealingRule(),
    new DamageRule(),
    new StayNearAlliesRule(FiendishMantleRange),
  ],
  aiCoefficients: new Map([[HealAllies, 1.2]]),
  aiGroups: [FiendishParty],
  align: ["Neutral", "Evil"],
  makesDeathSaves: true,
  abilities: [15, 8, 14, 10, 18, 13],
  pb: 3,
  levels: { Cleric: 5 },
  proficiency: {
    wis: "proficient",
    cha: "proficient",
    Insight: "proficient",
    Persuasion: "proficient",
  },
  damage: { fire: "resist", poison: "resist" },
  immunities: ["Poisoned"],
  languages: ["Abyssal", "Common"],
  features: [FiendishMantle, ShieldBash, Spellcasting, FightingStyleProtection],
  items: [
    { name: "splint armor", equip: true },
    { name: "shield", equip: true },
    { name: "mace", equip: true },
  ],
};
export default OGonrit;
