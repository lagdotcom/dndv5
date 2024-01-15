import burstUrl from "@img/act/eldritch-burst.svg";
import counterspellUrl from "@img/spl/counterspell.svg";
import rebukeUrl from "@img/spl/hellish-rebuke.svg";
import tokenUrl from "@img/tok/boss/birnotec.png";

import AbstractAction from "../../actions/AbstractAction";
import CastSpell from "../../actions/CastSpell";
import SuccessResponseCollector from "../../collectors/SuccessResponseCollector";
import { DamageColours, makeIcon } from "../../colours";
import { HasTarget } from "../../configs";
import MonsterTemplate from "../../data/MonsterTemplate";
import Engine from "../../Engine";
import SimpleFeature from "../../features/SimpleFeature";
import { isEnemy } from "../../filters";
import { DifficultyClass } from "../../flavours";
import EvaluateLater from "../../interruptions/EvaluateLater";
import YesNoChoice from "../../interruptions/YesNoChoice";
import MessageBuilder from "../../MessageBuilder";
import TargetResolver from "../../resolvers/TargetResolver";
import { simpleSpell } from "../../spells/common";
import InnateSpellcasting from "../../spells/InnateSpellcasting";
import ArmorOfAgathysSpell from "../../spells/level1/ArmorOfAgathys";
import SpellHelper from "../../spells/SpellHelper";
import { atSet } from "../../types/AttackTag";
import { chSet } from "../../types/CheckTag";
import Combatant from "../../types/Combatant";
import { SpecifiedWithin } from "../../types/EffectArea";
import Priority from "../../types/Priority";
import { poSet } from "../../utils/ai";
import { sieve } from "../../utils/array";
import { checkConfig } from "../../utils/config";
import { _dd } from "../../utils/dice";

const getEldritchBurstArea = (who: Combatant): SpecifiedWithin => ({
  type: "within",
  radius: 5,
  who,
});

const BurstIcon = makeIcon(burstUrl, DamageColours.force);

const burstMainDamage = _dd(2, 10, "force");
const burstMinorDamage = _dd(1, 10, "force");

const EldritchBurstSpell = simpleSpell<HasTarget>({
  status: "implemented",
  name: "Eldritch Burst",
  icon: BurstIcon,
  level: 0,
  school: "Evocation",
  lists: ["Warlock"],
  description: `Make a ranged spell attack against the target. On a hit, the target takes 2d10 force damage. All other creatures within 5 ft. must make a Dexterity save or take 1d10 force damage.`,

  getConfig: (g) => ({ target: new TargetResolver(g, 120, [isEnemy]) }),
  getAffectedArea: (g, caster, { target }) =>
    target && [getEldritchBurstArea(target)],
  getDamage: () => [burstMainDamage],
  getTargets: (g, caster, { target }) => sieve(target),
  getAffected: (g, caster, { target }) =>
    g.getInside(getEldritchBurstArea(target)),

  async apply(sh) {
    const { outcome, attack, hit, critical, target } = await sh.attack({
      target: sh.config.target,
      type: "ranged",
    });
    if (outcome === "cancelled") return;

    if (hit) {
      const hitDamage = await sh.rollDamage({ critical, target });
      await sh.damage({
        attack,
        critical,
        damageInitialiser: hitDamage,
        damageType: "force",
        target,
      });
    }

    const damageInitialiser = await sh.rollDamage({
      critical,
      damage: [burstMinorDamage],
    });
    for (const who of sh.affected.filter((other) => other !== target)) {
      const { damageResponse } = await sh.save({
        who,
        ability: "dex",
        save: "zero",
      });
      await sh.damage({
        attack,
        critical,
        damageInitialiser,
        damageResponse,
        damageType: "force",
        target: who,
      });
    }
  },
});

const BirnotecSpellcasting = new InnateSpellcasting("Spellcasting", "cha");

const EldritchBurst = new SimpleFeature(
  "Eldritch Burst",
  `Ranged Spell Attack: +8 to hit, range 120 ft., one target. Hit: 11 (2d10) force damage. All other creatures within 5 ft. must make a DC 15 Dexterity save or take 5 (1d10) force damage.`,
  (g, me) => {
    me.spellcastingMethods.add(BirnotecSpellcasting);
    me.preparedSpells.add(EldritchBurstSpell);

    g.events.on("GetActions", ({ detail: { who, actions } }) => {
      if (who === me)
        actions.push(
          new CastSpell(g, me, BirnotecSpellcasting, EldritchBurstSpell),
        );
    });
  },
);

const ArmorOfAgathys = new SimpleFeature(
  "Armor of Agathys",
  `Birnotec has 15 temporary hit points. While these persist, any creature that hits him in melee takes 15 cold damage.`,
  (g, me) => {
    g.events.on("BattleStarted", ({ detail: { interrupt } }) => {
      interrupt.add(
        new EvaluateLater(me, ArmorOfAgathys, Priority.Normal, async () => {
          const action = new CastSpell(
            g,
            me,
            BirnotecSpellcasting,
            ArmorOfAgathysSpell,
          );
          const config = { slot: 3 };
          await action.spell.apply(
            new SpellHelper(g, action, action.spell, action.method, config),
            config,
          );
        }),
      );
    });
  },
);

const AntimagicIcon = makeIcon(counterspellUrl);

class AntimagicProdigyAction extends AbstractAction<HasTarget> {
  constructor(
    g: Engine,
    actor: Combatant,
    private dc: DifficultyClass,
    private success: SuccessResponseCollector,
  ) {
    super(
      g,
      actor,
      "Antimagic Prodigy",
      "implemented",
      { target: new TargetResolver(g, Infinity, [isEnemy]) },
      {
        time: "reaction",
        icon: AntimagicIcon,
        description: `When an enemy casts a spell, Birnotec forces them to make a DC 15 Arcana check or lose the spell.`,
      },
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
    const { g, actor, dc, success } = this;
    const save = await g.abilityCheck(dc, {
      who: target,
      attacker: actor,
      skill: "Arcana",
      ability: "int",
      tags: chSet("counterspell"),
    });

    if (save.outcome === "fail") {
      success.add("fail", AntimagicProdigy);
      g.text(new MessageBuilder().co(actor).text(" counters the spell."));
    }
  }
}

const AntimagicProdigy = new SimpleFeature(
  "Antimagic Prodigy",
  `When an enemy casts a spell, Birnotec forces them to make a DC 15 Arcana check or lose the spell.`,
  (g, me) => {
    g.events.on("GetActions", ({ detail: { who, actions } }) => {
      if (who === me)
        actions.push(
          new AntimagicProdigyAction(g, me, 15, new SuccessResponseCollector()),
        );
    });

    g.events.on(
      "SpellCast",
      ({ detail: { who: target, interrupt, success } }) => {
        const action = new AntimagicProdigyAction(g, me, 15, success);
        const config: HasTarget = { target };
        if (checkConfig(g, action, config))
          interrupt.add(
            new YesNoChoice(
              me,
              AntimagicProdigy,
              "Antimagic Prodigy",
              `Use ${me.name}'s reaction to attempt to counter the spell?`,
              Priority.ChangesOutcome,
              () => g.act(action, config),
            ),
          );
      },
    );
  },
);

const RebukeIcon = makeIcon(rebukeUrl, DamageColours.fire);

// TODO just turn this into the actual spell
class HellishRebukeAction extends AbstractAction<HasTarget> {
  constructor(
    g: Engine,
    actor: Combatant,
    private dc: DifficultyClass,
  ) {
    super(
      g,
      actor,
      "Hellish Rebuke",
      "implemented",
      { target: new TargetResolver(g, Infinity, [isEnemy]) },
      {
        time: "reaction",
        icon: RebukeIcon,
        description: `When an enemy damages Birnotec, they must make a DC 15 Dexterity save or take 11 (2d10) fire damage, or half on a success.`,
        tags: ["harmful", "spell"],
      },
    );
  }

  generateAttackConfigs(targets: Combatant[]) {
    return targets.map((target) => ({
      config: { target },
      positioning: poSet(),
    }));
  }

  getDamage() {
    return [_dd(2, 10, "fire")];
  }

  getAffected({ target }: HasTarget) {
    return [target];
  }
  getTargets({ target }: Partial<HasTarget>) {
    return sieve(target);
  }

  async apply({ target }: HasTarget) {
    await super.apply({ target });
    const { g, actor: attacker, dc } = this;

    const damage = await g.rollDamage(2, {
      source: HellishRebuke,
      size: 10,
      attacker,
      target,
      damageType: "fire",
      tags: atSet("magical", "spell"),
    });

    const { damageResponse } = await g.save({
      source: HellishRebuke,
      type: { type: "flat", dc },
      who: target,
      attacker,
      ability: "dex",
      tags: ["magic"],
    });

    await g.damage(
      HellishRebuke,
      "fire",
      { attacker, target },
      [["fire", damage]],
      damageResponse,
    );
  }
}

const HellishRebuke = new SimpleFeature(
  "Hellish Rebuke",
  `When an enemy damages Birnotec, they must make a DC 15 Dexterity save or take 11 (2d10) fire damage, or half on a success.`,
  (g, me) => {
    g.events.on("GetActions", ({ detail: { who, actions } }) => {
      if (who === me) actions.push(new HellishRebukeAction(g, me, 15));
    });

    g.events.on(
      "CombatantDamaged",
      ({ detail: { who, attacker, interrupt } }) => {
        if (who === me && attacker) {
          const action = new HellishRebukeAction(g, me, 15);
          const config: HasTarget = { target: attacker };
          if (checkConfig(g, action, config))
            interrupt.add(
              new YesNoChoice(
                me,
                HellishRebuke,
                "Hellish Rebuke",
                `Use ${me.name}'s reaction to retaliate for 2d10 fire damage?`,
                Priority.Late,
                () => g.act(action, config),
              ),
            );
        }
      },
    );
  },
);

const Birnotec: MonsterTemplate = {
  name: "Birnotec",
  cr: 5,
  type: "humanoid",
  tokenUrl,
  hpMax: 35,
  align: ["Lawful", "Evil"],
  makesDeathSaves: true,
  abilities: [6, 15, 8, 12, 13, 20],
  pb: 3,
  proficiency: {
    wis: "proficient",
    cha: "proficient",
    Arcana: "proficient",
    Nature: "proficient",
  },
  damage: { poison: "immune" },
  immunities: ["Poisoned"],
  languages: ["Common", "Abyssal"],
  features: [ArmorOfAgathys, EldritchBurst, AntimagicProdigy, HellishRebuke],
};
export default Birnotec;
