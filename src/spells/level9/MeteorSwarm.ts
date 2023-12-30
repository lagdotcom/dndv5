import iconUrl from "@img/spl/meteor-swarm.svg";

import { DamageColours, makeIcon } from "../../colours";
import { HasPoints } from "../../configs";
import MultiPointResolver from "../../resolvers/MultiPointResolver";
import { atSet } from "../../types/AttackTag";
import { SpecifiedSphere } from "../../types/EffectArea";
import Point from "../../types/Point";
import { uniq } from "../../utils/array";
import { _dd } from "../../utils/dice";
import { miles } from "../../utils/distance";
import { simpleSpell } from "../common";

const getMeteorSwarmArea = (centre: Point): SpecifiedSphere => ({
  type: "sphere",
  centre,
  radius: 40,
});

const MeteorSwarm = simpleSpell<HasPoints>({
  status: "implemented",
  name: "Meteor Swarm",
  icon: makeIcon(iconUrl, DamageColours.fire),
  level: 9,
  school: "Evocation",
  v: true,
  s: true,
  lists: ["Sorcerer", "Wizard"],
  description: `Blazing orbs of fire plummet to the ground at four different points you can see within range. Each creature in a 40-foot-radius sphere centered on each point you choose must make a Dexterity saving throw. The sphere spreads around corners. A creature takes 20d6 fire damage and 20d6 bludgeoning damage on a failed save, or half as much damage on a successful one. A creature in the area of more than one fiery burst is affected only once.

  The spell damages objects in the area and ignites flammable objects that aren't being worn or carried.`,
  isHarmful: true,

  getConfig: (g) => ({ points: new MultiPointResolver(g, 4, 4, miles(1)) }),
  getTargets: () => [],
  getAffected: (g, caster, { points }) =>
    uniq(points.flatMap((point) => g.getInside(getMeteorSwarmArea(point)))),
  getDamage: () => [_dd(20, 6, "fire"), _dd(20, 6, "bludgeoning")],

  async apply(g, attacker, method, config) {
    const affected = MeteorSwarm.getAffected(g, attacker, config);
    const type = method.getSaveType(attacker, MeteorSwarm);

    const fire = await g.rollDamage(20, {
      size: 6,
      damageType: "fire",
      source: MeteorSwarm,
      spell: MeteorSwarm,
      method,
      tags: atSet("magical", "spell"),
    });
    const bludgeoning = await g.rollDamage(20, {
      size: 6,
      damageType: "bludgeoning",
      source: MeteorSwarm,
      spell: MeteorSwarm,
      method,
      tags: atSet("magical", "spell"),
    });

    for (const who of affected) {
      const { damageResponse } = await g.save({
        source: MeteorSwarm,
        type,
        attacker,
        who,
        ability: "dex",
        spell: MeteorSwarm,
        method,
        tags: ["magic"],
      });
      await g.damage(
        MeteorSwarm,
        "fire",
        { spell: MeteorSwarm, method, target: who },
        [
          ["fire", fire],
          ["bludgeoning", bludgeoning],
        ],
        damageResponse,
      );
    }
  },
});
export default MeteorSwarm;
