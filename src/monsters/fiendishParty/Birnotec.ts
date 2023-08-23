import CastSpell from "../../actions/CastSpell";
import { HasTarget } from "../../configs";
import Engine from "../../Engine";
import { notImplementedFeature } from "../../features/common";
import SimpleFeature from "../../features/SimpleFeature";
import YesNoChoice from "../../interruptions/YesNoChoice";
import Monster from "../../Monster";
import TargetResolver from "../../resolvers/TargetResolver";
import { simpleSpell } from "../../spells/common";
import InnateSpellcasting from "../../spells/InnateSpellcasting";
import SpellAttack from "../../spells/SpellAttack";
import { chSet } from "../../types/CheckTag";
import Combatant from "../../types/Combatant";
import { SpecifiedWithin } from "../../types/EffectArea";
import { svSet } from "../../types/SaveTag";
import { _dd } from "../../utils/dice";
import tokenUrl from "./Birnotec_token.png";

function getArea(g: Engine, target: Combatant): SpecifiedWithin {
  return {
    type: "within",
    radius: 5,
    target,
    position: g.getState(target).position,
  };
}

const EldritchBurstSpell = simpleSpell<HasTarget>({
  status: "implemented",
  name: "Eldritch Burst",
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

// TODO [TEMPORARYHP]
const ArmorOfAgathys = notImplementedFeature(
  "Armor of Agathys",
  `Birnotec has 15 temporary hit points. While these persist, any creature that hits him in melee takes 15 cold damage.`,
);

const AntimagicProdigy = new SimpleFeature(
  "Antimagic Prodigy",
  `When an enemy casts a spell, Birnotec forces them to make a DC 15 Arcana check or lose the spell.`,
  (g, me) => {
    g.events.on("SpellCast", (e) => {
      const { who, interrupt } = e.detail;

      if (me.time.has("reaction") && who.side !== me.side)
        interrupt.add(
          new YesNoChoice(
            me,
            AntimagicProdigy,
            "Antimagic Prodigy",
            `Use ${me.name}'s reaction to attempt to counter the spell?`,
            async () => {
              me.time.delete("reaction");

              const save = await g.abilityCheck(15, {
                who,
                attacker: me,
                skill: "Arcana",
                ability: "int",
                tags: chSet("counterspell"),
              });

              // TODO [MESSAGES]

              if (save.outcome === "fail") e.preventDefault();
            },
          ),
        );
    });
  },
);

const HellishRebuke = new SimpleFeature(
  "Hellish Rebuke",
  `When an enemy damages Birnotec, they must make a DC 15 Dexterity save or take 11 (2d10) fire damage, or half on a success.`,
  (g, me) => {
    g.events.on(
      "CombatantDamaged",
      ({ detail: { who, attacker, interrupt } }) => {
        if (who === me && me.time.has("reaction"))
          interrupt.add(
            new YesNoChoice(
              me,
              HellishRebuke,
              "Hellish Rebuke",
              `Use ${me.name}'s reaction to retaliate for 2d10 fire damage?`,
              async () => {
                me.time.delete("reaction");

                const damage = await g.rollDamage(2, {
                  source: HellishRebuke,
                  size: 10,
                  attacker: me,
                  target: attacker,
                  damageType: "fire",
                });

                const save = await g.savingThrow(15, {
                  who: attacker,
                  attacker: me,
                  ability: "dex",
                  tags: svSet(),
                });

                await g.damage(
                  HellishRebuke,
                  "fire",
                  { attacker: me, target: attacker },
                  [["fire", damage]],
                  save.damageResponse,
                );
              },
            ),
          );
      },
    );
  },
);

export default class Birnotec extends Monster {
  constructor(g: Engine) {
    super(g, "Birnotec", 5, "humanoid", "medium", tokenUrl);
    this.diesAtZero = false;
    this.hp = this.hpMax = 35;
    this.movement.set("speed", 30);
    this.setAbilityScores(6, 15, 8, 12, 13, 20);
    this.pb = 3;

    this.saveProficiencies.add("wis");
    this.saveProficiencies.add("cha");
    this.skills.set("Arcana", 1);
    this.skills.set("Nature", 1);
    // TODO immune to poison damage, poisoned status
    this.languages.add("Abyssal");
    this.languages.add("Common");

    this.addFeature(ArmorOfAgathys);
    this.addFeature(EldritchBurst);
    this.addFeature(AntimagicProdigy);
    this.addFeature(HellishRebuke);

    // TODO
    // this.addEffect(ArmorOfAgathysEffect, { duration: Infinity, amount: 15 });
  }
}
