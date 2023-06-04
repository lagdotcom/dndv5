import ErrorCollector from "../../collectors/ErrorCollector";
import { HasPoints } from "../../configs";
import Engine from "../../Engine";
import MultiPointResolver from "../../resolvers/MultiPointResolver";
import { TemporaryResource } from "../../resources";
import Action, { ActionConfig } from "../../types/Action";
import ActionTime from "../../types/ActionTime";
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
  attacker.spendResource(MeteorResource, points.length);

  const damage = await g.rollDamage(2, {
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

      const mul = save ? 0.5 : 1;
      await g.damage(
        MelfsMinuteMeteors,
        "fire",
        { attacker, target, spell: MelfsMinuteMeteors, method },
        [["fire", damage]],
        mul
      );
    }
  }

  // TODO stop concentrating if resource=0
}

class FireMeteorsAction implements Action<HasPoints> {
  config: ActionConfig<HasPoints>;
  name: string;
  time: ActionTime;

  constructor(
    public g: Engine,
    public actor: Combatant,
    public method: SpellcastingMethod
  ) {
    this.name = "Melf's Minute Meteors";
    this.time = "bonus action";

    const meteors = actor.resources.get(MeteorResource.name) ?? 2;
    this.config = {
      points: new MultiPointResolver(g, 1, Math.min(2, meteors), 120),
    };
  }

  getAffectedArea({ points }: HasPoints) {
    if (points)
      return points.map(
        (centre) => ({ type: "sphere", centre, radius: 5 } as const)
      );
  }

  getConfig() {
    return this.config;
  }

  getDamage() {
    return [dd(2, 6, "fire")];
  }

  check({ points }: Partial<HasPoints>, ec = new ErrorCollector()) {
    if (!this.actor.time.has(this.time)) ec.add(`No ${this.time} left`, this);

    if (!this.actor.hasResource(MeteorResource, points?.length ?? 1))
      ec.add(`Not enough meteors left`, this);

    return ec;
  }

  async apply(config: HasPoints) {
    return fireMeteors(this.g, this.actor, this.method, config);
  }
}

const MelfsMinuteMeteors = scalingSpell<HasPoints>({
  implemented: true,
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

  getAffectedArea: (g, { points }) =>
    points && points.map((centre) => ({ type: "sphere", centre, radius: 5 })),

  getDamage: () => [dd(2, 6, "fire")],

  async apply(g, attacker, method, { points, slot }) {
    const meteors = slot * 2;
    attacker.initResource(MeteorResource, meteors);

    await fireMeteors(g, attacker, method, { points });

    let meteorActionEnabled = false;

    const removeMeteorAction = g.events.on(
      "getActions",
      ({ detail: { who, actions } }) => {
        if (who === attacker && meteorActionEnabled)
          actions.push(new FireMeteorsAction(g, attacker, method));
      }
    );

    const removeTurnListener = g.events.on(
      "turnEnded",
      ({ detail: { who } }) => {
        if (who === attacker) {
          meteorActionEnabled = true;
          removeTurnListener();
        }
      }
    );

    attacker.concentrateOn({
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
