import AbstractAction from "../../actions/AbstractAction";
import ErrorCollector from "../../collectors/ErrorCollector";
import { HasPoints } from "../../configs";
import Engine from "../../Engine";
import MultiPointResolver from "../../resolvers/MultiPointResolver";
import { TemporaryResource } from "../../resources";
import Combatant from "../../types/Combatant";
import SpellcastingMethod from "../../types/SpellcastingMethod";
import { dd } from "../../utils/dice";
import { getSaveDC } from "../../utils/dnd";
import { minutes } from "../../utils/time";
import { scalingSpell } from "../common";

const MeteorResource = new TemporaryResource("Melf's Minute Meteors", 6);

async function fireMeteors(
  g: Engine,
  attacker: Combatant,
  method: SpellcastingMethod,
  { points }: HasPoints
) {
  // TODO Sculpt Spells
  attacker.spendResource(MeteorResource, points.length);

  const damage = await g.rollDamage(2, {
    source: MelfsMinuteMeteors,
    attacker,
    size: 6,
    spell: MelfsMinuteMeteors,
    method,
    damageType: "fire",
  });
  const dc = getSaveDC(attacker, method.ability);

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
        tags: new Set(),
      });

      await g.damage(
        MelfsMinuteMeteors,
        "fire",
        { attacker, target, spell: MelfsMinuteMeteors, method },
        [["fire", damage]],
        save.damageResponse
      );
    }
  }

  // TODO stop concentrating if resource=0
}

class FireMeteorsAction extends AbstractAction<HasPoints> {
  constructor(g: Engine, actor: Combatant, public method: SpellcastingMethod) {
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
          120
        ),
      },
      "bonus action",
      undefined,
      [dd(2, 6, "fire")]
    );
  }

  getAffectedArea({ points }: Partial<HasPoints>) {
    if (points)
      return points.map(
        (centre) => ({ type: "sphere", centre, radius: 5 } as const)
      );
  }

  check({ points }: Partial<HasPoints>, ec: ErrorCollector) {
    if (!this.actor.hasResource(MeteorResource, points?.length ?? 1))
      ec.add(`Not enough meteors left`, this);

    return super.check({ points }, ec);
  }

  async apply(config: HasPoints) {
    return fireMeteors(this.g, this.actor, this.method, config);
  }
}

const MelfsMinuteMeteors = scalingSpell<HasPoints>({
  status: "implemented",
  name: "Melf's Minute Meteors",
  level: 3,
  school: "Evocation",
  concentration: true,
  v: true,
  s: true,
  m: "niter, sulfur, and pine tar formed into a bead",
  lists: ["Sorcerer", "Wizard"],

  getConfig: (g) => ({
    points: new MultiPointResolver(g, 1, 2, 120),
  }),

  getAffectedArea: (g, caster, { points }) =>
    points && points.map((centre) => ({ type: "sphere", centre, radius: 5 })),
  getTargets: (g, caster, { points }) =>
    points.flatMap((centre) =>
      g.getInside({ type: "sphere", centre, radius: 5 })
    ),

  getDamage: () => [dd(2, 6, "fire")],

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
      }
    );

    const removeTurnListener = g.events.on(
      "TurnEnded",
      ({ detail: { who } }) => {
        if (who === attacker) {
          meteorActionEnabled = true;
          removeTurnListener();
        }
      }
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
