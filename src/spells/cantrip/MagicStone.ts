import AbstractAction from "../../actions/AbstractAction";
import ErrorCollector from "../../collectors/ErrorCollector";
import { HasTarget } from "../../configs";
import Engine from "../../Engine";
import { Unsubscribe } from "../../events/Dispatcher";
import TargetResolver from "../../resolvers/TargetResolver";
import { TemporaryResource } from "../../resources";
import Combatant from "../../types/Combatant";
import SpellcastingMethod from "../../types/SpellcastingMethod";
import { dd } from "../../utils/dice";
import { simpleSpell } from "../common";

const MagicStoneResource = new TemporaryResource("Magic Stone", 3);

class MagicStoneAction extends AbstractAction<HasTarget> {
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
      { target: new TargetResolver(g, 60) },
      undefined,
      undefined,
      [dd(1, 6, "bludgeoning")]
    );
  }

  check(config: Partial<HasTarget>, ec = new ErrorCollector()): ErrorCollector {
    if (!this.actor.hasResource(MagicStoneResource))
      ec.add("no magic stones left", MagicStoneAction);

    return super.check(config, ec);
  }

  async apply({ target }: HasTarget) {
    super.apply({ target });

    this.actor.spendResource(MagicStoneResource);
    if (this.actor.getResource(MagicStoneResource) < 1) this.unsubscribe();

    // TODO spend action/attack

    const { attack, critical, hit } = await this.g.attack({
      who: this.actor,
      type: "ranged",
      target,
      ability: this.method.ability,
      spell: MagicStone,
      method: this.method,
    });

    if (hit) {
      const amount = await this.g.rollDamage(
        1,
        {
          size: 6,
          damageType: "bludgeoning",
          attacker: this.actor,
          target,
          ability: this.method.ability,
          spell: MagicStone,
          method: this.method,
        },
        critical
      );

      await this.g.damage(
        this,
        "bludgeoning",
        {
          attack,
          attacker: this.actor,
          target,
          ability: this.method.ability,
          critical,
          spell: MagicStone,
          method: this.method,
        },
        [["bludgeoning", amount]]
      );
    }
  }
}

// TODO technically you can cast this on someone else
const MagicStone = simpleSpell({
  incomplete: true,
  name: "Magic Stone",
  level: 0,
  school: "Transmutation",
  time: "bonus action",
  v: true,
  s: true,
  lists: ["Artificer", "Druid", "Warlock"],

  getConfig: () => ({}),

  async apply(g, caster, method) {
    caster.initResource(MagicStoneResource);

    // TODO if you cast it twice in a row this will not work well
    const unsubscribe = g.events.on(
      "getActions",
      ({ detail: { who, actions } }) => {
        if (who === caster && who.hasResource(MagicStoneResource))
          actions.push(new MagicStoneAction(g, who, method, unsubscribe));
      }
    );
  },
});
export default MagicStone;
