import AbstractAction from "../../actions/AbstractAction";
import ActiveEffectArea from "../../ActiveEffectArea";
import { HasCaster, HasPoint } from "../../configs";
import Effect from "../../Effect";
import Engine, { EngineSaveConfig } from "../../Engine";
import PointResolver from "../../resolvers/PointResolver";
import { chSet } from "../../types/CheckTag";
import Combatant from "../../types/Combatant";
import { arSet, SpecifiedCube } from "../../types/EffectArea";
import { EffectConfig } from "../../types/EffectType";
import Point from "../../types/Point";
import SpellcastingMethod from "../../types/SpellcastingMethod";
import { minutes } from "../../utils/time";
import { simpleSpell } from "../common";
import MultiSaveEffect from "../MultiSaveEffect";

type Config = HasCaster & { affected: Set<Combatant> };

const getEntangleSave = (
  who: Combatant,
  config: EffectConfig<Config>,
): EngineSaveConfig<Config> => ({
  source: EntangleEffect,
  type: config.method.getSaveType(config.caster, Entangle),
  who,
  attacker: config.caster,
  ability: "wis",
  spell: Entangle,
  effect: EntangleEffect,
  config,
  tags: ["magic", "impedes movement", "plant"],
});

class BreakFreeFromEntangleAction extends AbstractAction {
  constructor(
    g: Engine,
    actor: Combatant,
    public caster: Combatant,
    public method: SpellcastingMethod,
  ) {
    super(
      g,
      actor,
      "Break Free from Entangle",
      "implemented",
      {},
      {
        time: "action",
        description: `Make a Strength check to break free of the plants.`,
        tags: ["escape move prevention"],
      },
    );
  }

  getAffected() {
    return [this.actor];
  }
  getTargets() {
    return [];
  }

  async apply() {
    await super.apply({});

    const type = this.method.getSaveType(this.caster, Entangle);
    const dc = await this.g.getSaveDC({ source: Entangle, type });
    const result = await this.g.abilityCheck(dc.bonus.result, {
      ability: "str",
      who: this.actor,
      tags: chSet(),
    });

    if (result.outcome === "success")
      await this.actor.removeEffect(EntangleEffect);
  }
}

const EntangleEffect = new Effect<Config>(
  "Entangle",
  "turnEnd",
  (g) => {
    g.events.on("GetConditions", ({ detail: { who, conditions } }) => {
      if (who.hasEffect(EntangleEffect))
        conditions.add("Restrained", EntangleEffect);
    });

    g.events.on("GetActions", ({ detail: { who, actions } }) => {
      const config = who.getEffectConfig(EntangleEffect);
      if (config)
        actions.push(
          new BreakFreeFromEntangleAction(g, who, config.caster, config.method),
        );
    });
  },
  { tags: ["magic"] },
);

// TODO this should be 'square' on the ground...
const getEntangleArea = (centre: Point): SpecifiedCube => ({
  type: "cube",
  centre,
  length: 20,
});

const Entangle = simpleSpell<HasPoint>({
  status: "implemented",
  name: "Entangle",
  level: 1,
  school: "Conjuration",
  concentration: true,
  v: true,
  s: true,
  lists: ["Druid"],
  description: `Grasping weeds and vines sprout from the ground in a 20-foot square starting from a point within range. For the duration, these plants turn the ground in the area into difficult terrain.

  A creature in the area when you cast the spell must succeed on a Strength saving throw or be restrained by the entangling plants until the spell ends. A creature restrained by the plants can use its action to make a Strength check against your spell save DC. On a success, it frees itself.
  
  When the spell ends, the conjured plants wilt away.`,

  getConfig: (g) => ({ point: new PointResolver(g, 90) }),

  getTargets: () => [],
  getAffectedArea: (g, caster, { point }) => point && [getEntangleArea(point)],
  getAffected: (g, caster, { point }) => g.getInside(getEntangleArea(point)),

  async apply(g, caster, method, { point }) {
    const shape = getEntangleArea(point);
    const area = new ActiveEffectArea(
      "Entangle",
      shape,
      arSet("difficult terrain", "plants"),
      "green",
      ({ detail: { where, difficult } }) => {
        if (area.points.has(where)) difficult.add("magical plants", Entangle);
      },
    );
    g.addEffectArea(area);

    const mse = new MultiSaveEffect(
      g,
      caster,
      Entangle,
      { point },
      method,
      EntangleEffect,
      minutes(1),
      ["Restrained"],
      getEntangleSave,
    );

    if (await mse.apply({}))
      await mse.concentrate(async () => g.removeEffectArea(area));
  },
});
export default Entangle;