import burstUrl from "@img/act/eldritch-burst.svg";
import tokenUrl from "@img/tok/boss/birnotec.png";

import AbstractAction from "../../actions/AbstractAction";
import CastSpell from "../../actions/CastSpell";
import ErrorCollector from "../../collectors/ErrorCollector";
import SuccessResponseCollector from "../../collectors/SuccessResponseCollector";
import { DamageColours, makeIcon } from "../../colours";
import { HasTarget } from "../../configs";
import Engine from "../../Engine";
import SimpleFeature from "../../features/SimpleFeature";
import EvaluateLater from "../../interruptions/EvaluateLater";
import YesNoChoice from "../../interruptions/YesNoChoice";
import Monster from "../../Monster";
import TargetResolver from "../../resolvers/TargetResolver";
import { simpleSpell } from "../../spells/common";
import InnateSpellcasting from "../../spells/InnateSpellcasting";
import ArmorOfAgathysSpell from "../../spells/level1/ArmorOfAgathys";
import SpellAttack from "../../spells/SpellAttack";
import { chSet } from "../../types/CheckTag";
import Combatant from "../../types/Combatant";
import { SpecifiedWithin } from "../../types/EffectArea";
import { svSet } from "../../types/SaveTag";
import { _dd } from "../../utils/dice";

function getArea(g: Engine, target: Combatant): SpecifiedWithin {
  return {
    type: "within",
    radius: 5,
    target,
    position: g.getState(target).position,
  };
}

const BurstIcon = makeIcon(burstUrl, DamageColours.force);

const EldritchBurstSpell = simpleSpell<HasTarget>({
  status: "implemented",
  name: "Eldritch Burst",
  icon: BurstIcon,
  level: 0,
  school: "Evocation",
  lists: ["Warlock"],

  getConfig: (g) => ({ target: new TargetResolver(g, 120) }),
  getAffectedArea: (g, caster, { target }) => target && [getArea(g, target)],
  getDamage: () => [_dd(2, 10, "force")],
  getTargets: (g, caster, { target }) => [target],

  async apply(g, caster, method, { target }) {
    const rsa = new SpellAttack(
      g,
      caster,
      EldritchBurstSpell,
      BirnotecSpellcasting,
      "ranged",
      { target },
    );

    const attack = await rsa.attack(target);
    if (attack.outcome === "cancelled") return;

    if (attack.hit) {
      const damage = await rsa.getDamage(target);
      await rsa.damage(target, damage);
    }

    const damage = await g.rollDamage(
      1,
      { size: 10, source: this, attacker: caster, damageType: "force" },
      attack.critical,
    );

    for (const other of g.getInside(getArea(g, target))) {
      if (other === target) continue;

      const save = await g.savingThrow(
        15,
        {
          attacker: caster,
          who: other,
          ability: "dex",
          spell: EldritchBurstSpell,
          method,
          tags: svSet(),
        },
        { fail: "normal", save: "zero" },
      );
      await g.damage(
        this,
        "force",
        { attacker: caster, target: other, spell: EldritchBurstSpell, method },
        [["force", damage]],
        save.damageResponse,
      );
    }
  },
});

const BirnotecSpellcasting = new InnateSpellcasting(
  "Spellcasting",
  "cha",
  () => undefined,
);

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
        new EvaluateLater(me, ArmorOfAgathys, async () => {
          await ArmorOfAgathysSpell.apply(g, me, BirnotecSpellcasting, {
            slot: 3,
          });
        }),
      );
    });
  },
);

class AntimagicProdigyAction extends AbstractAction<HasTarget> {
  constructor(
    g: Engine,
    actor: Combatant,
    private dc: number,
    private success: SuccessResponseCollector,
  ) {
    super(
      g,
      actor,
      "Antimagic Prodigy",
      "implemented",
      { target: new TargetResolver(g, Infinity) },
      {
        time: "reaction",
        description: `When an enemy casts a spell, Birnotec forces them to make a DC 15 Arcana check or lose the spell.`,
      },
    );
  }

  check({ target }: Partial<HasTarget>, ec: ErrorCollector) {
    if (target?.side === this.actor.side) ec.add("enemy only", this);
    return super.check({ target }, ec);
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

    // TODO [MESSAGES]
    if (save.outcome === "fail") success.add("fail", AntimagicProdigy);
  }
}

const AntimagicProdigy = new SimpleFeature(
  "Antimagic Prodigy",
  `When an enemy casts a spell, Birnotec forces them to make a DC 15 Arcana check or lose the spell.`,
  (g, me) => {
    g.events.on(
      "SpellCast",
      ({ detail: { who: target, interrupt, success } }) => {
        const action = new AntimagicProdigyAction(g, me, 15, success);
        if (g.check(action, { target }).result)
          interrupt.add(
            new YesNoChoice(
              me,
              AntimagicProdigy,
              "Antimagic Prodigy",
              `Use ${me.name}'s reaction to attempt to counter the spell?`,
              async () => await action.apply({ target }),
            ),
          );
      },
    );
  },
);

class HellishRebukeAction extends AbstractAction<HasTarget> {
  constructor(
    g: Engine,
    actor: Combatant,
    private dc: number,
  ) {
    super(
      g,
      actor,
      "Hellish Rebuke",
      "implemented",
      { target: new TargetResolver(g, Infinity) },
      {
        time: "reaction",
        description: `When an enemy damages Birnotec, they must make a DC 15 Dexterity save or take 11 (2d10) fire damage, or half on a success.`,
      },
    );
  }

  async apply({ target }: HasTarget) {
    await super.apply({ target });
    const { g, actor, dc } = this;

    const damage = await g.rollDamage(2, {
      source: HellishRebuke,
      size: 10,
      attacker: actor,
      target,
      damageType: "fire",
    });

    const save = await g.savingThrow(dc, {
      who: target,
      attacker: actor,
      ability: "dex",
      tags: svSet(),
    });

    await g.damage(
      HellishRebuke,
      "fire",
      { attacker: actor, target },
      [["fire", damage]],
      save.damageResponse,
    );
  }
}

const HellishRebuke = new SimpleFeature(
  "Hellish Rebuke",
  `When an enemy damages Birnotec, they must make a DC 15 Dexterity save or take 11 (2d10) fire damage, or half on a success.`,
  (g, me) => {
    g.events.on(
      "CombatantDamaged",
      ({ detail: { who, attacker, interrupt } }) => {
        if (who === me) {
          const action = new HellishRebukeAction(g, me, 15);
          const config = { target: attacker };
          if (g.check(action, config).result)
            interrupt.add(
              new YesNoChoice(
                me,
                HellishRebuke,
                "Hellish Rebuke",
                `Use ${me.name}'s reaction to retaliate for 2d10 fire damage?`,
                async () => await action.apply(config),
              ),
            );
        }
      },
    );
  },
);

export default class Birnotec extends Monster {
  constructor(g: Engine) {
    super(g, "Birnotec", 5, "humanoid", "medium", tokenUrl, 35);
    this.diesAtZero = false;
    this.movement.set("speed", 30);
    this.setAbilityScores(6, 15, 8, 12, 13, 20);
    this.pb = 3;

    this.saveProficiencies.add("wis");
    this.saveProficiencies.add("cha");
    this.skills.set("Arcana", 1);
    this.skills.set("Nature", 1);
    this.damageResponses.set("poison", "immune");
    this.conditionImmunities.add("Poisoned");
    this.languages.add("Abyssal");
    this.languages.add("Common");

    this.addFeature(ArmorOfAgathys);
    this.addFeature(EldritchBurst);
    this.addFeature(AntimagicProdigy);
    this.addFeature(HellishRebuke);
  }
}
