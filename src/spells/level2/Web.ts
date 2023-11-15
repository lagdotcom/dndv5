import iconUrl from "@img/spl/web.svg";

import AbstractAction from "../../actions/AbstractAction";
import ActiveEffectArea from "../../ActiveEffectArea";
import { makeIcon } from "../../colours";
import { HasPoint } from "../../configs";
import Effect from "../../Effect";
import Engine from "../../Engine";
import { Unsubscribe } from "../../events/Dispatcher";
import EvaluateLater from "../../interruptions/EvaluateLater";
import PointResolver from "../../resolvers/PointResolver";
import { chSet } from "../../types/CheckTag";
import Combatant from "../../types/Combatant";
import { coSet } from "../../types/ConditionName";
import { arSet, SpecifiedCube } from "../../types/EffectArea";
import Point from "../../types/Point";
import SpellcastingMethod from "../../types/SpellcastingMethod";
import { hours, minutes } from "../../utils/time";
import { simpleSpell } from "../common";

const WebIcon = makeIcon(iconUrl);

class BreakFreeFromWebAction extends AbstractAction {
  constructor(
    g: Engine,
    actor: Combatant,
    public caster: Combatant,
    public method: SpellcastingMethod,
  ) {
    super(
      g,
      actor,
      "Break Free from Webs",
      "implemented",
      {},
      {
        icon: WebIcon,
        time: "action",
        description: `Make a Strength check to break free of the webs.`,
      },
    );
  }

  async apply() {
    await super.apply({});

    const type = this.method.getSaveType(this.caster, Web);
    const dc = await this.g.getSaveDC({ source: Web, type });
    const result = await this.g.abilityCheck(dc.bonus.result, {
      ability: "str",
      who: this.actor,
      tags: chSet(),
    });

    if (result.outcome === "success") await this.actor.removeEffect(Webbed);
  }
}

const Webbed = new Effect<{ caster: Combatant; method: SpellcastingMethod }>(
  "Webbed",
  "turnStart",
  (g) => {
    g.events.on("GetActions", ({ detail: { who, actions } }) => {
      const config = who.getEffectConfig(Webbed);
      if (config)
        actions.push(
          new BreakFreeFromWebAction(g, who, config.caster, config.method),
        );
    });

    g.events.on("GetConditions", ({ detail: { who, conditions } }) => {
      if (who.hasEffect(Webbed)) conditions.add("Restrained", Webbed);
    });
  },
  { icon: WebIcon },
);

const getWebArea = (centre: Point): SpecifiedCube => ({
  type: "cube",
  length: 20,
  centre,
});

class WebController {
  subscriptions: Unsubscribe[];
  affectedThisTurn: Set<Combatant>;

  constructor(
    public g: Engine,
    public caster: Combatant,
    public method: SpellcastingMethod,
    public centre: Point,
    public shape = getWebArea(centre),
    public area = new ActiveEffectArea(
      "Web",
      shape,
      arSet("difficult terrain", "lightly obscured"),
      "white",
    ),
  ) {
    g.addEffectArea(area);

    this.affectedThisTurn = new Set();
    this.subscriptions = [];

    // Each creature that starts its turn in the webs or that enters them during its turn must make a Dexterity saving throw. On a failed save, the creature is restrained as long as it remains in the webs or until it breaks free.
    this.subscriptions.push(
      g.events.on("TurnStarted", ({ detail: { who, interrupt } }) => {
        this.affectedThisTurn.clear();
        if (g.getInside(shape).includes(who))
          interrupt.add(this.getWebber(who));
      }),
      g.events.on("CombatantMoved", ({ detail: { who, interrupt } }) => {
        if (g.getInside(shape).includes(who))
          interrupt.add(this.getWebber(who));
      }),
    );
  }

  getWebber(target: Combatant) {
    const { g, caster, method } = this;

    return new EvaluateLater(target, Web, async () => {
      if (this.affectedThisTurn.has(target)) return;
      this.affectedThisTurn.add(target);

      const { outcome } = await g.save({
        source: Web,
        type: this.method.getSaveType(this.caster, Web),
        ability: "dex",
        attacker: caster,
        method,
        spell: Web,
        who: target,
      });

      if (outcome === "fail")
        await target.addEffect(Webbed, {
          caster,
          method,
          duration: minutes(1),
          conditions: coSet("Restrained"),
        });
    });
  }

  onSpellEnd = async () => {
    this.g.removeEffectArea(this.area);
    for (const cleanup of this.subscriptions) cleanup();
  };
}

const Web = simpleSpell<HasPoint>({
  status: "incomplete",
  name: "Web",
  icon: WebIcon,
  level: 2,
  school: "Conjuration",
  concentration: true,
  v: true,
  s: true,
  m: "a bit of spiderweb",
  lists: ["Artificer", "Sorcerer", "Wizard"],
  description: `You conjure a mass of thick, sticky webbing at a point of your choice within range. The webs fill a 20-foot cube from that point for the duration. The webs are difficult terrain and lightly obscure their area.

  If the webs aren't anchored between two solid masses (such as walls or trees) or layered across a floor, wall, or ceiling, the conjured web collapses on itself, and the spell ends at the start of your next turn. Webs layered over a flat surface have a depth of 5 feet.

  Each creature that starts its turn in the webs or that enters them during its turn must make a Dexterity saving throw. On a failed save, the creature is restrained as long as it remains in the webs or until it breaks free.

  A creature restrained by the webs can use its action to make a Strength check against your spell save DC. If it succeeds, it is no longer restrained.

  The webs are flammable. Any 5-foot cube of webs exposed to fire burns away in 1 round, dealing 2d4 fire damage to any creature that starts its turn in the fire.`,

  getConfig: (g) => ({ point: new PointResolver(g, 60) }),
  getTargets: () => [],
  getAffectedArea: (g, caster, { point }) => point && [getWebArea(point)],
  getAffected: (g, caster, { point }) => g.getInside(getWebArea(point)),

  async apply(g, caster, method, { point }) {
    // TODO [TERRAIN] If the webs aren't anchored between two solid masses (such as walls or trees) or layered across a floor, wall, or ceiling, the conjured web collapses on itself, and the spell ends at the start of your next turn. Webs layered over a flat surface have a depth of 5 feet.
    // TODO [TERRAIN] The webs are flammable. Any 5-foot cube of webs exposed to fire burns away in 1 round, dealing 2d4 fire damage to any creature that starts its turn in the fire.

    const controller = new WebController(g, caster, method, point);
    caster.concentrateOn({
      spell: Web,
      duration: hours(1),
      onSpellEnd: controller.onSpellEnd,
    });
  },
});
export default Web;
