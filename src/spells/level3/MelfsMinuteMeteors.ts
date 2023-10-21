import iconUrl from "@img/spl/melfs-minute-meteors.svg";

import AbstractAction from "../../actions/AbstractAction";
import { DamageColours, makeIcon } from "../../colours";
import { HasPoints } from "../../configs";
import Engine from "../../Engine";
import MultiPointResolver from "../../resolvers/MultiPointResolver";
import { TemporaryResource } from "../../resources";
import Combatant from "../../types/Combatant";
import SpellcastingMethod from "../../types/SpellcastingMethod";
import { _dd } from "../../utils/dice";
import { minutes } from "../../utils/time";
import { scalingSpell } from "../common";

const MMMIcon = makeIcon(iconUrl, DamageColours.fire);
const MMMResource = new TemporaryResource("Melf's Minute Meteors", 6);

async function fireMeteors(
  g: Engine,
  attacker: Combatant,
  method: SpellcastingMethod,
  { points }: HasPoints,
  spendMeteors = true,
) {
  if (spendMeteors) attacker.spendResource(MMMResource, points.length);

  // TODO Sculpt Spells
  const damage = await g.rollDamage(2, {
    source: MelfsMinuteMeteors,
    attacker,
    size: 6,
    spell: MelfsMinuteMeteors,
    method,
    damageType: "fire",
  });
  for (const point of points) {
    for (const target of g.getInside({
      type: "sphere",
      centre: point,
      radius: 5,
    })) {
      const { damageResponse } = await g.save({
        source: MelfsMinuteMeteors,
        type: method.getSaveType(attacker, MelfsMinuteMeteors),
        ability: "dex",
        attacker,
        spell: MelfsMinuteMeteors,
        method,
        who: target,
      });

      await g.damage(
        MelfsMinuteMeteors,
        "fire",
        { attacker, target, spell: MelfsMinuteMeteors, method },
        [["fire", damage]],
        damageResponse,
      );
    }
  }

  if (spendMeteors && attacker.getResource(MMMResource) <= 0)
    await attacker.endConcentration();
}

class FireMeteorsAction extends AbstractAction<HasPoints> {
  constructor(
    g: Engine,
    actor: Combatant,
    public method: SpellcastingMethod,
  ) {
    super(
      g,
      actor,
      "Melf's Minute Meteors",
      "incomplete",
      {
        points: new MultiPointResolver(
          g,
          1,
          Math.min(2, actor.resources.get(MMMResource.name) ?? 2),
          120,
        ),
      },
      {
        icon: MMMIcon,
        time: "bonus action",
        damage: [_dd(2, 6, "fire")],
        description: `You can expend one or two of the meteors, sending them streaking toward a point or points you choose within 120 feet of you. Once a meteor reaches its destination or impacts against a solid surface, the meteor explodes. Each creature within 5 feet of the point where the meteor explodes must make a Dexterity saving throw. A creature takes 2d6 fire damage on a failed save, or half as much damage on a successful one.`,
      },
    );
  }

  // TODO: generateAttackConfigs

  getAffectedArea({ points }: Partial<HasPoints>) {
    if (points)
      return points.map(
        (centre) => ({ type: "sphere", centre, radius: 5 }) as const,
      );
  }

  getDamage() {
    return [_dd(2, 6, "fire")];
  }

  getResources({ points }: Partial<HasPoints>) {
    return new Map([[MMMResource, points?.length ?? 1]]);
  }

  getTargets(config: HasPoints) {
    return (
      this.getAffectedArea(config)?.flatMap((area) => this.g.getInside(area)) ??
      []
    );
  }

  async apply(config: HasPoints) {
    await super.apply(config);
    return fireMeteors(this.g, this.actor, this.method, config, false);
  }
}

const MelfsMinuteMeteors = scalingSpell<HasPoints>({
  status: "implemented",
  name: "Melf's Minute Meteors",
  icon: MMMIcon,
  level: 3,
  school: "Evocation",
  concentration: true,
  v: true,
  s: true,
  m: "niter, sulfur, and pine tar formed into a bead",
  lists: ["Sorcerer", "Wizard"],
  description: `You create six tiny meteors in your space. They float in the air and orbit you for the spell's duration. When you cast the spell—and as a bonus action on each of your turns thereafter—you can expend one or two of the meteors, sending them streaking toward a point or points you choose within 120 feet of you. Once a meteor reaches its destination or impacts against a solid surface, the meteor explodes. Each creature within 5 feet of the point where the meteor explodes must make a Dexterity saving throw. A creature takes 2d6 fire damage on a failed save, or half as much damage on a successful one.

  At Higher Levels. When you cast this spell using a spell slot of 4th level or higher, the number of meteors created increases by two for each slot level above 3rd.`,

  // TODO: generateAttackConfigs

  getConfig: (g) => ({
    points: new MultiPointResolver(g, 1, 2, 120),
  }),

  getAffectedArea: (g, caster, { points }) =>
    points && points.map((centre) => ({ type: "sphere", centre, radius: 5 })),
  getTargets: (g, caster, { points }) =>
    points.flatMap((centre) =>
      g.getInside({ type: "sphere", centre, radius: 5 }),
    ),

  getDamage: () => [_dd(2, 6, "fire")],

  async apply(g, attacker, method, { points, slot }) {
    const meteors = slot * 2;
    attacker.initResource(MMMResource, meteors);

    await fireMeteors(g, attacker, method, { points });

    let meteorActionEnabled = false;

    const removeMeteorAction = g.events.on(
      "GetActions",
      ({ detail: { who, actions } }) => {
        if (who === attacker && meteorActionEnabled)
          actions.push(new FireMeteorsAction(g, attacker, method));
      },
    );

    const removeTurnListener = g.events.on(
      "TurnEnded",
      ({ detail: { who } }) => {
        if (who === attacker) {
          meteorActionEnabled = true;
          removeTurnListener();
        }
      },
    );

    await attacker.concentrateOn({
      spell: MelfsMinuteMeteors,
      duration: minutes(10),
      async onSpellEnd() {
        removeMeteorAction();
        removeTurnListener();
        attacker.removeResource(MMMResource);
      },
    });
  },
});
export default MelfsMinuteMeteors;
