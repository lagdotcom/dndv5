import AbstractAction from "../../actions/AbstractAction";
import { HasPoints } from "../../configs";
import Engine from "../../Engine";
import MultiPointResolver from "../../resolvers/MultiPointResolver";
import { TemporaryResource } from "../../resources";
import Combatant from "../../types/Combatant";
import Resource from "../../types/Resource";
import { svSet } from "../../types/SaveTag";
import SpellcastingMethod from "../../types/SpellcastingMethod";
import { _dd } from "../../utils/dice";
import { minutes } from "../../utils/time";
import { scalingSpell } from "../common";
import iconUrl from "./icons/melfs-minute-meteors.svg";

const MeteorResource = new TemporaryResource("Melf's Minute Meteors", 6);

async function fireMeteors(
  g: Engine,
  attacker: Combatant,
  method: SpellcastingMethod,
  { points }: HasPoints,
  spendMeteors = true,
) {
  if (spendMeteors) attacker.spendResource(MeteorResource, points.length);

  // TODO Sculpt Spells
  const damage = await g.rollDamage(2, {
    source: MelfsMinuteMeteors,
    attacker,
    size: 6,
    spell: MelfsMinuteMeteors,
    method,
    damageType: "fire",
  });
  const dc = method.getSaveDC(attacker, MelfsMinuteMeteors);

  for (const point of points) {
    for (const target of g.getInside({
      type: "sphere",
      centre: point,
      radius: 5,
    })) {
      const save = await g.savingThrow(dc, {
        ability: "dex",
        attacker,
        spell: MelfsMinuteMeteors,
        method,
        who: target,
        tags: svSet(),
      });

      await g.damage(
        MelfsMinuteMeteors,
        "fire",
        { attacker, target, spell: MelfsMinuteMeteors, method },
        [["fire", damage]],
        save.damageResponse,
      );
    }
  }

  // TODO stop concentrating if resource=0
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
          Math.min(2, actor.resources.get(MeteorResource.name) ?? 2),
          120,
        ),
      },
      {
        iconUrl,
        time: "bonus action",
        damage: [_dd(2, 6, "fire")],
        description: `You can expend one or two of the meteors, sending them streaking toward a point or points you choose within 120 feet of you. Once a meteor reaches its destination or impacts against a solid surface, the meteor explodes. Each creature within 5 feet of the point where the meteor explodes must make a Dexterity saving throw. A creature takes 2d6 fire damage on a failed save, or half as much damage on a successful one.`,
      },
    );
  }

  getAffectedArea({ points }: Partial<HasPoints>) {
    if (points)
      return points.map(
        (centre) => ({ type: "sphere", centre, radius: 5 }) as const,
      );
  }

  getResources({ points }: Partial<HasPoints>): Map<Resource, number> {
    return new Map([[MeteorResource, points?.length ?? 1]]);
  }

  async apply(config: HasPoints) {
    await super.apply(config);
    return fireMeteors(this.g, this.actor, this.method, config, false);
  }
}

const MelfsMinuteMeteors = scalingSpell<HasPoints>({
  status: "implemented",
  name: "Melf's Minute Meteors",
  icon: { url: iconUrl },
  level: 3,
  school: "Evocation",
  concentration: true,
  v: true,
  s: true,
  m: "niter, sulfur, and pine tar formed into a bead",
  lists: ["Sorcerer", "Wizard"],
  description: `You create six tiny meteors in your space. They float in the air and orbit you for the spell's duration. When you cast the spell—and as a bonus action on each of your turns thereafter—you can expend one or two of the meteors, sending them streaking toward a point or points you choose within 120 feet of you. Once a meteor reaches its destination or impacts against a solid surface, the meteor explodes. Each creature within 5 feet of the point where the meteor explodes must make a Dexterity saving throw. A creature takes 2d6 fire damage on a failed save, or half as much damage on a successful one.

  At Higher Levels. When you cast this spell using a spell slot of 4th level or higher, the number of meteors created increases by two for each slot level above 3rd.`,

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
    attacker.initResource(MeteorResource, meteors);

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
        attacker.removeResource(MeteorResource);
      },
    });
  },
});
export default MelfsMinuteMeteors;
