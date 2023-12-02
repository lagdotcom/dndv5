import burstUrl from "@img/act/eldritch-burst.svg";
import counterspellUrl from "@img/spl/counterspell.svg";
import rebukeUrl from "@img/spl/hellish-rebuke.svg";
import tokenUrl from "@img/tok/boss/birnotec.png";

import AbstractAction from "../../actions/AbstractAction";
import CastSpell from "../../actions/CastSpell";
import SuccessResponseCollector from "../../collectors/SuccessResponseCollector";
import { DamageColours, makeIcon } from "../../colours";
import { HasTarget } from "../../configs";
import Engine from "../../Engine";
import SimpleFeature from "../../features/SimpleFeature";
import { isEnemy } from "../../filters";
import EvaluateLater from "../../interruptions/EvaluateLater";
import YesNoChoice from "../../interruptions/YesNoChoice";
import MessageBuilder from "../../MessageBuilder";
import Monster from "../../Monster";
import TargetResolver from "../../resolvers/TargetResolver";
import { simpleSpell } from "../../spells/common";
import InnateSpellcasting from "../../spells/InnateSpellcasting";
import ArmorOfAgathysSpell from "../../spells/level1/ArmorOfAgathys";
import SpellAttack from "../../spells/SpellAttack";
import { chSet } from "../../types/CheckTag";
import Combatant from "../../types/Combatant";
import { SpecifiedWithin } from "../../types/EffectArea";
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
  getDamage: () => [_dd(2, 10, "force")],
  getTargets: (g, caster, { target }) => sieve(target),
  getAffected: (g, caster, { target }) =>
    g.getInside(getEldritchBurstArea(target)),

  async apply(g, caster, method, { target }) {
    const rsa = new SpellAttack(
      g,
      caster,
      EldritchBurstSpell,
      BirnotecSpellcasting,
      "ranged",
      { target },
    );

    const { outcome, attack, hit, critical } = await rsa.attack(target);
    if (outcome === "cancelled") return;

    const { target: finalTarget } = attack.pre;

    if (hit) {
      const hitDamage = await rsa.getDamage(finalTarget);
      await rsa.damage(finalTarget, hitDamage);
    }

    const damage = await g.rollDamage(
      1,
      { size: 10, source: this, attacker: caster, damageType: "force" },
      critical,
    );

    for (const other of g.getInside(getEldritchBurstArea(finalTarget))) {
      if (other === finalTarget) continue;

      const { damageResponse } = await g.save({
        source: EldritchBurstSpell,
        type: { type: "flat", dc: 15 },
        attacker: caster,
        who: other,
        ability: "dex",
        spell: EldritchBurstSpell,
        method,
        save: "zero",
        tags: ["magic"],
      });
      await g.damage(
        this,
        "force",
        { attacker: caster, target: other, spell: EldritchBurstSpell, method },
        [["force", damage]],
        damageResponse,
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

const AntimagicIcon = makeIcon(counterspellUrl);

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
      { target: new TargetResolver(g, Infinity, [isEnemy]) },
      {
        time: "reaction",
        icon: AntimagicIcon,
        description: `When an enemy casts a spell, Birnotec forces them to make a DC 15 Arcana check or lose the spell.`,
      },
    );
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
              async () => {
                await g.act(action, config);
              },
            ),
          );
      },
    );
  },
);

const RebukeIcon = makeIcon(rebukeUrl, DamageColours.fire);

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
        if (who === me) {
          const action = new HellishRebukeAction(g, me, 15);
          const config: HasTarget = { target: attacker };
          if (checkConfig(g, action, config))
            interrupt.add(
              new YesNoChoice(
                me,
                HellishRebuke,
                "Hellish Rebuke",
                `Use ${me.name}'s reaction to retaliate for 2d10 fire damage?`,
                async () => {
                  await g.act(action, config);
                },
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
    this.addProficiency("Arcana", "proficient");
    this.addProficiency("Nature", "proficient");
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
