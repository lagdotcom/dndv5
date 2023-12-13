import { HasItem } from "../configs";
import Engine from "../Engine";
import MessageBuilder from "../MessageBuilder";
import ChoiceResolver from "../resolvers/ChoiceResolver";
import ActionTime from "../types/ActionTime";
import Combatant from "../types/Combatant";
import AbstractAction from "./AbstractAction";

export default class DoffAction extends AbstractAction<HasItem> {
  constructor(g: Engine, actor: Combatant) {
    super(
      g,
      actor,
      "Doff",
      "implemented",
      {
        item: new ChoiceResolver(
          g,
          Array.from(actor.equipment, (value) => ({
            label: value.name,
            value,
          })).filter(({ value }) => value.hands),
        ),
      },
      {
        description: `You can interact with one object or feature of the environment for free, during either your move or your action. For example, you could open a door during your move as you stride toward a foe, or you could draw your weapon as part of the same action you use to attack. If you want to interact with a second object, you need to use your action.`,
      },
    );
  }

  getAffected() {
    return [this.actor];
  }
  getTargets() {
    return [];
  }

  getTime(): ActionTime {
    if (this.actor.hasTime("item interaction")) return "item interaction";

    // If you want to interact with a second object, you need to use your action.
    return "action";
  }

  async apply({ item }: HasItem) {
    await super.apply({ item });

    if (this.actor.doff(item))
      this.g.text(
        new MessageBuilder()
          .co(this.actor)
          .text(" doffs their ")
          .it(item)
          .text("."),
      );
  }
}