import AbstractAttackAction from "../../actions/AbstractAttackAction";
import { HasTarget } from "../../configs";
import Engine from "../../Engine";
import { Unsubscribe } from "../../events/Dispatcher";
import TargetResolver from "../../resolvers/TargetResolver";
import { TemporaryResource } from "../../resources";
import Combatant from "../../types/Combatant";
import SpellcastingMethod from "../../types/SpellcastingMethod";
import { _dd } from "../../utils/dice";
import { simpleSpell } from "../common";

const MagicStoneResource = new TemporaryResource("Magic Stone", 3);

class MagicStoneAction extends AbstractAttackAction<HasTarget> {
  constructor(
    g: Engine,
    actor: Combatant,
    public method: SpellcastingMethod,
    public unsubscribe: Unsubscribe
  ) {
    super(
      g,
      actor,
      "Throw Magic Stone",
      "incomplete",
      { target: new TargetResolver(g, 60) },
      {
        damage: [_dd(1, 6, "bludgeoning")],
        resources: [[MagicStoneResource, 1]],
      }
    );
  }

  async apply({ target }: HasTarget) {
    super.apply({ target });
    const { g, actor, method } = this;

    if (actor.getResource(MagicStoneResource) < 1) this.unsubscribe();

    const { attack, critical, hit } = await g.attack({
      who: actor,
      tags: new Set(["ranged", "spell", "magical"]),
      target,
      ability: method.ability,
      spell: MagicStone,
      method,
    });

    if (hit) {
      const amount = await g.rollDamage(
        1,
        {
          source: MagicStone,
          size: 6,
          damageType: "bludgeoning",
          attacker: actor,
          target,
          ability: method.ability,
          spell: MagicStone,
          method,
        },
        critical
      );

      await g.damage(
        this,
        "bludgeoning",
        {
          attack,
          attacker: actor,
          target,
          ability: method.ability,
          critical,
          spell: MagicStone,
          method,
        },
        [["bludgeoning", amount]]
      );
    }
  }
}

// TODO technically you can cast this on someone else
const MagicStone = simpleSpell({
  status: "incomplete",
  name: "Magic Stone",
  level: 0,
  school: "Transmutation",
  time: "bonus action",
  v: true,
  s: true,
  lists: ["Artificer", "Druid", "Warlock"],

  getConfig: () => ({}),
  getTargets: (g, caster) => [caster],

  async apply(g, caster, method) {
    caster.initResource(MagicStoneResource);

    // TODO if you cast it twice in a row this will not work well
    const unsubscribe = g.events.on(
      "GetActions",
      ({ detail: { who, actions } }) => {
        if (who === caster && who.hasResource(MagicStoneResource))
          actions.push(new MagicStoneAction(g, who, method, unsubscribe));
      }
    );
  },
});
export default MagicStone;
