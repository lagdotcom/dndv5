import Engine from "../../Engine";
import SimpleFeature from "../../features/SimpleFeature";
import YesNoChoice from "../../interruptions/YesNoChoice";
import { TurnResource } from "../../resources";
import Combatant from "../../types/Combatant";
import { distance } from "../../utils/units";

function getSneakAttackDice(level: number) {
  return Math.ceil(level / 2);
}

function getFlanker(g: Engine, target: Combatant) {
  for (const flanker of g.combatants.keys()) {
    if (flanker.side === target.side) continue;
    if (flanker.conditions.has("Incapacitated")) continue;
    if (distance(g, flanker, target) > 5) continue;

    return flanker;
  }
}

const SneakAttackResource = new TurnResource("Sneak Attack", 1);

const SneakAttack = new SimpleFeature(
  "Sneak Attack",
  `Beginning at 1st level, you know how to strike subtly and exploit a foe's distraction. Once per turn, you can deal an extra 1d6 damage to one creature you hit with an attack if you have advantage on the attack roll. The attack must use a finesse or a ranged weapon.

You don't need advantage on the attack roll if another enemy of the target is within 5 feet of it, that enemy isn't incapacitated, and you don't have disadvantage on the attack roll.

The amount of the extra damage increases as you gain levels in this class, as shown in the Sneak Attack column of the Rogue table.`,
  (g, me) => {
    const count = getSneakAttackDice(me.classLevels.get("Rogue") ?? 1);
    me.initResource(SneakAttackResource);

    g.events.on(
      "GatherDamage",
      ({
        detail: {
          ability,
          attack,
          attacker,
          critical,
          interrupt,
          map,
          target,
          weapon,
        },
      }) => {
        if (
          attacker === me &&
          me.hasResource(SneakAttackResource) &&
          attack &&
          weapon
        ) {
          const isFinesseOrRangedWeapon =
            weapon.properties.has("finesse") ||
            weapon.rangeCategory === "ranged";
          const hasAdvantage = attack.roll.diceType === "advantage";
          const didNotHaveDisadvantage = !attack.pre.diceType
            .getValidEntries()
            .includes("disadvantage");

          if (
            isFinesseOrRangedWeapon &&
            (hasAdvantage || (getFlanker(g, target) && didNotHaveDisadvantage))
          ) {
            interrupt.add(
              new YesNoChoice(
                attacker,
                SneakAttack,
                "Sneak Attack",
                `Do ${count * (critical ? 2 : 1)}d6 bonus damage on this hit?`,
                async () => {
                  me.spendResource(SneakAttackResource);

                  const damageType = weapon.damage.damageType;
                  const damage = await g.rollDamage(
                    count,
                    {
                      source: SneakAttack,
                      attacker,
                      target,
                      size: 6,
                      damageType,
                      weapon,
                      ability,
                    },
                    critical,
                  );
                  map.add(damageType, damage);
                },
              ),
            );
          }
        }
      },
    );
  },
);
export default SneakAttack;
