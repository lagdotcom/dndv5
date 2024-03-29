import iconUrl from "@img/spl/moonbeam.svg";

import AbstractAction from "../../actions/AbstractAction";
import ActiveEffectArea from "../../ActiveEffectArea";
import { DamageColours, makeIcon } from "../../colours";
import { HasPoint } from "../../configs";
import Engine from "../../Engine";
import { DiceCount, SpellSlot } from "../../flavours";
import EvaluateLater from "../../interruptions/EvaluateLater";
import OncePerTurnController from "../../OncePerTurnController";
import PointToPointResolver from "../../resolvers/PointToPointResolver";
import SubscriptionBag from "../../SubscriptionBag";
import { atSet } from "../../types/AttackTag";
import Combatant from "../../types/Combatant";
import { arSet, SpecifiedCylinder } from "../../types/EffectArea";
import Point from "../../types/Point";
import Priority from "../../types/Priority";
import SpellcastingMethod from "../../types/SpellcastingMethod";
import { _dd } from "../../utils/dice";
import { minutes } from "../../utils/time";
import { scalingSpell } from "../common";
import { affectsByPoint, doesScalingDamage, requiresSave } from "../helpers";

const MoonbeamIcon = makeIcon(iconUrl, DamageColours.radiant);

const getMoonbeamArea = (centre: Point): SpecifiedCylinder => ({
  type: "cylinder",
  centre,
  height: 40,
  radius: 5,
});

const getMoonbeamDamage = (slot: SpellSlot) =>
  _dd(slot as DiceCount, 10, "radiant");

class MoveMoonbeamAction extends AbstractAction<HasPoint> {
  constructor(
    g: Engine,
    public controller: MoonbeamController,
  ) {
    super(
      g,
      controller.caster,
      "Move Moonbeam",
      "implemented",
      { point: new PointToPointResolver(g, controller.centre, 60) },
      {
        icon: MoonbeamIcon,
        time: "action",
        description: `On each of your turns after you cast this spell, you can use an action to move the beam up to 60 feet in any direction.`,
        tags: ["harmful"], // TODO spell?
      },
    );
  }

  // TODO generateAttackConfigs

  getAffectedArea({ point }: Partial<HasPoint>) {
    if (point) return [getMoonbeamArea(point)];
  }

  getDamage({ point }: Partial<HasPoint>) {
    return point && [getMoonbeamDamage(this.controller.slot)];
  }

  getTargets() {
    return [];
  }

  getAffected({ point }: HasPoint) {
    return this.g.getInside(getMoonbeamArea(point));
  }

  async applyEffect({ point }: HasPoint) {
    this.controller.move(point);
  }
}

class MoonbeamController {
  area: ActiveEffectArea;
  hasBeenATurn: boolean;
  shape: SpecifiedCylinder;
  bag: SubscriptionBag;
  opt: OncePerTurnController;

  constructor(
    public g: Engine,
    public caster: Combatant,
    public method: SpellcastingMethod,
    public centre: Point,
    public slot: SpellSlot,
  ) {
    this.shape = getMoonbeamArea(centre);
    this.area = new ActiveEffectArea(
      "Moonbeam",
      this.shape,
      arSet("dim light"),
      "yellow",
    );
    g.addEffectArea(this.area);

    this.hasBeenATurn = false;
    this.opt = new OncePerTurnController(g);

    /* When a creature enters the spell's area for the first time on a turn or starts its turn there... */
    this.bag = new SubscriptionBag(
      g.events.on("TurnStarted", ({ detail: { who, interrupt } }) => {
        if (who === this.caster) this.hasBeenATurn = true;

        if (g.getInside(this.shape).includes(who))
          interrupt.add(this.getDamager(who));
      }),
      g.events.on("CombatantMoved", ({ detail: { who, interrupt } }) => {
        if (g.getInside(this.shape).includes(who))
          interrupt.add(this.getDamager(who));
      }),
    );

    /* On each of your turns after you cast this spell, you can use an action to move the beam up to 60 feet in any direction. */
    this.bag.add(
      g.events.on("GetActions", ({ detail: { who, actions } }) => {
        if (who === this.caster && this.hasBeenATurn)
          actions.push(new MoveMoonbeamAction(g, this));
      }),
    );
  }

  getDamager(target: Combatant) {
    const { opt, g, slot, caster: attacker, method } = this;

    return new EvaluateLater(target, Moonbeam, Priority.Normal, async () => {
      if (!opt.canBeAffected(target)) return;
      opt.affect(target);

      const {
        amount: { count, size },
        damageType,
      } = getMoonbeamDamage(slot);
      const damage = await g.rollDamage(count, {
        attacker,
        damageType,
        method,
        size,
        source: Moonbeam,
        spell: Moonbeam,
        target,
        tags: atSet("magical", "spell"),
      });

      const { damageResponse } = await g.save({
        source: Moonbeam,
        type: method.getSaveType(attacker, Moonbeam),
        ability: "con",
        attacker,
        method,
        spell: Moonbeam,
        who: target,
        tags: ["magic"],
        diceType: target.tags.has("shapechanger") ? "disadvantage" : "normal",
      });

      await g.damage(
        Moonbeam,
        "radiant",
        { attacker, method, spell: Moonbeam, target },
        [["radiant", damage]],
        damageResponse,
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
    this.bag.cleanup();
  };
}

const Moonbeam = scalingSpell<HasPoint>({
  status: "incomplete",
  name: "Moonbeam",
  icon: MoonbeamIcon,
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

  // TODO: generateAttackConfigs

  ...affectsByPoint(120, getMoonbeamArea, false),
  ...requiresSave("con"),
  ...doesScalingDamage(2, 0, 10, "radiant"),

  async apply({ g, caster, method }, { point, slot }) {
    const controller = new MoonbeamController(g, caster, method, point, slot);
    caster.concentrateOn({
      duration: minutes(1),
      spell: Moonbeam,
      onSpellEnd: controller.onSpellEnd,
    });
  },
});
export default Moonbeam;
