import ErrorCollector from "../collectors/ErrorCollector";
import Engine from "../Engine";
import MessageBuilder from "../MessageBuilder";
import ChoiceResolver from "../resolvers/ChoiceResolver";
import ActionTime from "../types/ActionTime";
import Combatant from "../types/Combatant";
import Item from "../types/Item";
import AbstractAction from "./AbstractAction";

type Config = { item: Item };

export default class DonAction extends AbstractAction<Config> {
  constructor(g: Engine, actor: Combatant) {
    super(
      g,
      actor,
      "Don",
      "implemented",
      {
        item: new ChoiceResolver(
          g,
          Array.from(actor.inventory, (value) => ({
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

  check(config: Partial<Config>, ec: ErrorCollector): ErrorCollector {
    if (config.item && config.item.hands > this.actor.freeHands)
      ec.add("not enough hands", this);

    return super.check(config, ec);
  }

  getTime(): ActionTime {
    if (this.actor.hasTime("item interaction")) return "item interaction";

    // If you want to interact with a second object, you need to use your action.
    return "action";
  }

  async apply({ item }: Config) {
    await super.apply({ item });

    this.actor.inventory.delete(item);
    this.actor.equipment.add(item);
    this.g.text(
      new MessageBuilder()
        .co(this.actor)
        .text(" dons their ")
        .it(item)
        .text("."),
    );
  }
}
