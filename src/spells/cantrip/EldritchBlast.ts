import { HasAllocations } from "../../configs";
import AllocationResolver from "../../resolvers/AllocationResolver";
import { _dd } from "../../utils/dice";
import { getCantripDice, simpleSpell } from "../common";
import { spellAttack } from "../helpers";

const getEldritchBlastDamage = (beams: number) => [_dd(beams, 10, "force")];

const EldritchBlast = simpleSpell<HasAllocations>({
  status: "implemented",
  name: "Eldritch Blast",
  level: 0,
  school: "Evocation",
  v: true,
  s: true,
  lists: ["Warlock"],
  description: `A beam of crackling energy streaks toward a creature within range. Make a ranged spell attack against the target. On a hit, the target takes 1d10 force damage.

The spell creates more than one beam when you reach higher levels: two beams at 5th level, three beams at 11th level, and four beams at 17th level. You can direct the beams at the same target or at different ones. Make a separate attack roll for each beam.`,
  isHarmful: true,

  ...spellAttack("ranged"),

  getConfig: (g, caster) => ({
    targets: new AllocationResolver(
      g,
      "Beams",
      getCantripDice(caster),
      getCantripDice(caster),
      120,
      [],
    ),
  }),
  getDamage: (g, caster) => getEldritchBlastDamage(getCantripDice(caster)),
  getTargets: (g, caster, { targets }) => targets?.map((e) => e.who) ?? [],
  getAffected: (g, caster, { targets }) => targets.map((e) => e.who),

  async apply(sh, { targets }) {
    const damage = getEldritchBlastDamage(1);
    for (const { amount, who } of targets)
      for (let i = 0; i < amount; i++) {
        const { attack, hit, critical, target } = await sh.attack({
          target: who,
          type: "ranged",
        });

        if (hit) {
          const damageInitialiser = await sh.rollDamage({
            critical,
            damage,
            target,
            tags: ["ranged"],
          });
          await sh.damage({
            attack,
            critical,
            damageInitialiser,
            damageType: "force",
            target,
          });
        }
      }
  },
});
export default EldritchBlast;
