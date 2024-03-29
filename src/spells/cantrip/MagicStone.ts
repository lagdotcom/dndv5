import iconUrl from "@img/spl/magic-stone.svg";

import { AbstractSingleTargetAttackAction } from "../../actions/AbstractAttackAction";
import { DamageColours, makeIcon } from "../../colours";
import { HasTarget } from "../../configs";
import Engine from "../../Engine";
import { Unsubscribe } from "../../events/Dispatcher";
import { notSelf } from "../../filters";
import MessageBuilder from "../../MessageBuilder";
import TargetResolver from "../../resolvers/TargetResolver";
import { TemporaryResource } from "../../resources";
import { atSet } from "../../types/AttackTag";
import Combatant from "../../types/Combatant";
import SpellcastingMethod from "../../types/SpellcastingMethod";
import { poSet, poWithin } from "../../utils/ai";
import { _dd } from "../../utils/dice";
import { simpleSpell } from "../common";
import { affectsSelf } from "../helpers";

const MagicStoneIcon = makeIcon(iconUrl, DamageColours.bludgeoning);

const MagicStoneResource = new TemporaryResource("Magic Stone", 3);

class MagicStoneAction extends AbstractSingleTargetAttackAction {
  constructor(
    g: Engine,
    actor: Combatant,
    public method: SpellcastingMethod,
    public unsubscribe: Unsubscribe,
  ) {
    super(
      g,
      actor,
      "Throw Magic Stone",
      "incomplete",
      "magic stone",
      "ranged",
      { target: new TargetResolver(g, 60, [notSelf]) },
      {
        icon: MagicStoneIcon,
        damage: [_dd(1, 6, "bludgeoning")],
        resources: [[MagicStoneResource, 1]],
      },
    );
  }

  generateAttackConfigs(targets: Combatant[]) {
    return targets.map((target) => ({
      config: { target },
      positioning: poSet(poWithin(60, target)),
    }));
  }

  async applyEffect({ target }: HasTarget) {
    const { g, actor, method } = this;

    if (actor.getResource(MagicStoneResource) < 1) this.unsubscribe();

    const { attack, critical, hit } = await g.attack({
      who: actor,
      tags: atSet("ranged", "spell", "magical"),
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
          target: attack.roll.type.target,
          ability: attack.roll.type.ability,
          spell: MagicStone,
          method: attack.roll.type.method,
          tags: attack.roll.type.tags,
        },
        critical,
      );

      await g.damage(
        this,
        "bludgeoning",
        {
          attack,
          attacker: actor,
          target: attack.roll.type.target,
          ability: attack.roll.type.ability,
          critical,
          spell: MagicStone,
          method: attack.roll.type.method,
        },
        [["bludgeoning", amount]],
      );
    }
  }
}

// TODO technically you can cast this on someone else
const MagicStone = simpleSpell({
  status: "incomplete",
  name: "Magic Stone",
  icon: MagicStoneIcon,
  level: 0,
  school: "Transmutation",
  time: "bonus action",
  v: true,
  s: true,
  lists: ["Artificer", "Druid", "Warlock"],
  description: `You touch one to three pebbles and imbue them with magic. You or someone else can make a ranged spell attack with one of the pebbles by throwing it or hurling it with a sling. If thrown, a pebble has a range of 60 feet. If someone else attacks with a pebble, that attacker adds your spellcasting ability modifier, not the attacker's, to the attack roll. On a hit, the target takes bludgeoning damage equal to 1d6 + your spellcasting ability modifier. Whether the attack hits or misses, the spell then ends on the stone.

  If you cast this spell again, the spell ends on any pebbles still affected by your previous casting.`,

  ...affectsSelf,

  async apply({ g, caster, method }) {
    caster.initResource(MagicStoneResource);

    g.text(
      new MessageBuilder()
        .co(caster)
        .text(` creates ${MagicStoneResource.maximum} magic stones.`),
    );

    // TODO if you cast it twice in a row this will not work well
    const unsubscribe = g.events.on(
      "GetActions",
      ({ detail: { who, actions } }) => {
        if (who === caster && who.hasResource(MagicStoneResource))
          actions.push(new MagicStoneAction(g, who, method, unsubscribe));
      },
    );
  },
});
export default MagicStone;
