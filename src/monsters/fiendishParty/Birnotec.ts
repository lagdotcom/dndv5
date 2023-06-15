import WeaponAttack from "../../actions/WeaponAttack";
import { HasTarget } from "../../configs";
import Engine from "../../Engine";
import { notImplementedFeature } from "../../features/common";
import SimpleFeature from "../../features/SimpleFeature";
import EvaluateLater from "../../interruptions/EvaluateLater";
import YesNoChoice from "../../interruptions/YesNoChoice";
import { AbstractWeapon } from "../../items/weapons";
import Monster from "../../Monster";
import { _dd } from "../../utils/dice";
import tokenUrl from "./Birnotec_token.png";

class EldritchBurst extends AbstractWeapon {
  constructor(g: Engine) {
    super(
      g,
      "Eldritch Burst",
      "natural",
      "ranged",
      _dd(2, 10, "force"),
      undefined,
      120,
      120
    );
    this.forceAbilityScore = "cha";

    g.events.on("AfterAction", ({ detail: { action, config, interrupt } }) => {
      if (action instanceof WeaponAttack && action.weapon === this)
        interrupt.add(
          new EvaluateLater(action.actor, this, async () => {
            const { actor: attacker } = action;
            const { target } = config as HasTarget;

            const damage = await g.rollDamage(1, {
              size: 10,
              damageType: "force",
              source: this,
              attacker,
              weapon: this,
            });

            for (const other of g.getInside({
              type: "within",
              target,
              position: g.getState(target).position,
              radius: 5,
            })) {
              if (target === other) continue;

              const save = await g.savingThrow(
                15,
                { attacker, who: other, ability: "dex", tags: new Set() },
                { fail: "normal", save: "zero" }
              );
              await g.damage(
                this,
                "force",
                { attacker, target: other, weapon: this },
                [["force", damage]],
                save.damageResponse
              );
            }
          })
        );
    });
  }
}

// TODO [TEMPORARYHP]
const ArmorOfAgathys = notImplementedFeature(
  "Armor of Agathys",
  `Birnotec has 15 temporary hit points. While these persist, any creature that hits him in melee takes 15 cold damage.`
);

// TODO [CANCELCAST]
const AntimagicProdigy = notImplementedFeature(
  "Antimagic Prodigy",
  `When an enemy casts a spell, Birnotec forces them to make a DC 15 Arcana save or lose the spell.`
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
                  tags: new Set(),
                });

                await g.damage(
                  HellishRebuke,
                  "fire",
                  { attacker: me, target: attacker },
                  [["fire", damage]],
                  save.damageResponse
                );
              }
            )
          );
      }
    );
  }
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
    this.addFeature(ArmorOfAgathys);

    this.naturalWeapons.add(new EldritchBurst(g));

    this.addFeature(AntimagicProdigy);
    this.addFeature(HellishRebuke);
  }
}
