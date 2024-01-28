import DndRule from "../../DndRule";
import Engine from "../../Engine";
import { AttackDetail } from "../../events/AttackEvent";
import SimpleFeature from "../../features/SimpleFeature";
import { CombatantID, DiceCount, PCClassLevel } from "../../flavours";
import YesNoChoice from "../../interruptions/YesNoChoice";
import { TurnResource } from "../../resources";
import { atSet } from "../../types/AttackTag";
import Combatant from "../../types/Combatant";
import Priority from "../../types/Priority";
import { getFlanker } from "../../utils/dnd";

function getSneakAttackDice(level: PCClassLevel): DiceCount {
  return Math.ceil(level / 2);
}

export type SneakAttackMethod = (
  g: Engine,
  target: Combatant,
  attack: AttackDetail,
) => boolean;
const SneakAttackConfigs = new Map<CombatantID, Set<SneakAttackMethod>>();
new DndRule("Sneak Attack", () => {
  SneakAttackConfigs.clear();
});
export function addSneakAttackMethod(
  who: Combatant,
  method: SneakAttackMethod,
) {
  const methods = SneakAttackConfigs.get(who.id) ?? new Set();
  methods.add(method);
  SneakAttackConfigs.set(who.id, methods);
}

const SneakAttackResource = new TurnResource("Sneak Attack", 1);

const SneakAttack = new SimpleFeature(
  "Sneak Attack",
  `Beginning at 1st level, you know how to strike subtly and exploit a foe's distraction. Once per turn, you can deal an extra 1d6 damage to one creature you hit with an attack if you have advantage on the attack roll. The attack must use a finesse or a ranged weapon.

You don't need advantage on the attack roll if another enemy of the target is within 5 feet of it, that enemy isn't incapacitated, and you don't have disadvantage on the attack roll.

The amount of the extra damage increases as you gain levels in this class, as shown in the Sneak Attack column of the Rogue table.`,
  (g, me) => {
    const count = getSneakAttackDice(me.getClassLevel("Rogue", 1));
    me.initResource(SneakAttackResource);
    addSneakAttackMethod(me, (g, target, attack) => {
      const noDisadvantage = !attack.pre.diceType
        .getValues()
        .includes("disadvantage");

      return !!getFlanker(g, me, target) && noDisadvantage;
    });

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
          const advantage = attack.roll.diceType === "advantage";
          const methods = Array.from(SneakAttackConfigs.get(me.id) ?? []);

          if (
            isFinesseOrRangedWeapon &&
            (advantage || methods.find((method) => method(g, target, attack)))
          ) {
            interrupt.add(
              new YesNoChoice(
                attacker,
                SneakAttack,
                "Sneak Attack",
                `Do ${count * (critical ? 2 : 1)}d6 bonus damage on this hit?`,
                Priority.Normal,
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
                      tags: atSet(),
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
