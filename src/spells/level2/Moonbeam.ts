import AbstractAction from "../../actions/AbstractAction";
import ActiveEffectArea from "../../ActiveEffectArea";
import { HasPoint } from "../../configs";
import Engine from "../../Engine";
import { Unsubscribe } from "../../events/Dispatcher";
import EvaluateLater from "../../interruptions/EvaluateLater";
import PointResolver from "../../resolvers/PointResolver";
import PointToPointResolver from "../../resolvers/PointToPointResolver";
import Combatant from "../../types/Combatant";
import { arSet, SpecifiedCylinder } from "../../types/EffectArea";
import Point from "../../types/Point";
import { svSet } from "../../types/SaveTag";
import SpellcastingMethod from "../../types/SpellcastingMethod";
import { _dd } from "../../utils/dice";
import { getSaveDC } from "../../utils/dnd";
import { minutes } from "../../utils/time";
import { scalingSpell } from "../common";

const getArea = (centre: Point): SpecifiedCylinder => ({
  type: "cylinder",
  centre,
  height: 40,
  radius: 5,
});

class MoveMoonbeamAction extends AbstractAction<HasPoint> {
  constructor(
    g: Engine,
    public controller: MoonbeamController
  ) {
    super(
      g,
      controller.caster,
      "Move Moonbeam",
      "implemented",
      { point: new PointToPointResolver(g, controller.centre, 60) },
      {
        time: "action",
        description: `On each of your turns after you cast this spell, you can use an action to move the beam up to 60 feet in any direction.`,
      }
    );
  }

  getAffectedArea({ point }: Partial<HasPoint>) {
    if (point) return [getArea(point)];
  }

  async apply({ point }: HasPoint) {
    super.apply({ point });
    await this.controller.move(point);
  }
}

class MoonbeamController {
  area: ActiveEffectArea;
  hasBeenATurn: boolean;
  hurtThisTurn: Set<Combatant>;
  shape: SpecifiedCylinder;
  subscriptions: Unsubscribe[];

  constructor(
    public g: Engine,
    public caster: Combatant,
    public method: SpellcastingMethod,
    public centre: Point,
    public slot: number
  ) {
    this.shape = getArea(centre);
    this.area = new ActiveEffectArea(
      "Moonbeam",
      this.shape,
      arSet("dim light")
    );
    g.addEffectArea(this.area);

    this.hasBeenATurn = false;
    this.hurtThisTurn = new Set();
    this.subscriptions = [];

    this.subscriptions.push(
      g.events.on("TurnStarted", ({ detail: { who, interrupt } }) => {
        this.hurtThisTurn.clear();
        if (who === this.caster) this.hasBeenATurn = true;

        if (g.getInside(this.shape).includes(who))
          interrupt.add(this.getDamager(who));
      })
    );
    this.subscriptions.push(
      g.events.on("CombatantMoved", ({ detail: { who, interrupt } }) => {
        if (g.getInside(this.shape).includes(who))
          interrupt.add(this.getDamager(who));
      })
    );

    /* On each of your turns after you cast this spell, you can use an action to move the beam up to 60 feet in any direction. */
    this.subscriptions.push(
      g.events.on("GetActions", ({ detail: { who, actions } }) => {
        if (who === this.caster && this.hasBeenATurn)
          actions.push(new MoveMoonbeamAction(g, this));
      })
    );
  }

  getDamager(target: Combatant) {
    return new EvaluateLater(target, Moonbeam, async () => {
      if (this.hurtThisTurn.has(target)) return;
      this.hurtThisTurn.add(target);

      const damage = await this.g.rollDamage(this.slot, {
        attacker: this.caster,
        damageType: "radiant",
        method: this.method,
        size: 10,
        source: Moonbeam,
        spell: Moonbeam,
        target,
      });
      const dc = getSaveDC(this.caster, this.method.ability);

      // TODO A shapechanger makes its saving throw with disadvantage.
      const result = await this.g.savingThrow(dc, {
        ability: "con",
        attacker: this.caster,
        method: this.method,
        spell: Moonbeam,
        who: target,
        tags: svSet(),
      });

      await this.g.damage(
        Moonbeam,
        "radiant",
        {
          attacker: this.caster,
          method: this.method,
          spell: Moonbeam,
          target: target,
        },
        [["radiant", damage]],
        result.damageResponse
      );

      // TODO If it fails, it also instantly reverts to its original form and can't assume a different form until it leaves the spell's light.
    });
  }

  move(centre: Point) {
    this.g.removeEffectArea(this.area);
    this.centre = centre;
    this.shape.centre = centre;
    this.g.addEffectArea(this.area);
  }

  onSpellEnd = async () => {
    this.g.removeEffectArea(this.area);
    for (const cleanup of this.subscriptions) cleanup();
  };
}

const Moonbeam = scalingSpell<HasPoint>({
  status: "incomplete",
  name: "Moonbeam",
  level: 2,
  school: "Evocation",
  concentration: true,
  v: true,
  s: true,
  m: "several seeds of any moonseed plant and a piece of opalescent feldspar",
  lists: ["Druid"],
  description: `A silvery beam of pale light shines down in a 5-foot-radius, 40-foot-high cylinder centered on a point within range. Until the spell ends, dim light fills the cylinder.

  When a creature enters the spell's area for the first time on a turn or starts its turn there, it is engulfed in ghostly flames that cause searing pain, and it must make a Constitution saving throw. It takes 2d10 radiant damage on a failed save, or half as much damage on a successful one.

  A shapechanger makes its saving throw with disadvantage. If it fails, it also instantly reverts to its original form and can't assume a different form until it leaves the spell's light.

  On each of your turns after you cast this spell, you can use an action to move the beam up to 60 feet in any direction.

  At Higher Levels. When you cast this spell using a spell slot of 3rd level or higher, the damage increases by 1d10 for each slot level above 2nd.`,

  getConfig: (g) => ({ point: new PointResolver(g, 120) }),
  getAffectedArea: (g, caster, { point }) => point && [getArea(point)],
  getDamage: (g, caster, method, { slot }) => [_dd(slot ?? 2, 10, "radiant")],
  getTargets: () => [],

  async apply(g, caster, method, { point, slot }) {
    const controller = new MoonbeamController(g, caster, method, point, slot);

    caster.concentrateOn({
      duration: minutes(1),
      spell: Moonbeam,
      onSpellEnd: controller.onSpellEnd,
    });
  },
});
export default Moonbeam;
