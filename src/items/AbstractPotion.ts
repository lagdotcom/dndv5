import { AbstractSelfAction } from "../actions/AbstractAction";
import Engine from "../Engine";
import { Description, Url } from "../flavours";
import Combatant from "../types/Combatant";
import ImplementationStatus from "../types/ImplementationStatus";
import { ItemRarity, PotionItem } from "../types/Item";
import ItemBase from "./ItemBase";

class DrinkAction extends AbstractSelfAction {
  constructor(
    g: Engine,
    actor: Combatant,
    public item: AbstractPotion,
  ) {
    super(
      g,
      actor,
      `Drink (${item.name})`,
      item.status,
      {},
      { time: "action", description: item.description },
    );
  }

  async applyEffect() {
    this.actor.removeFromInventory(this.item);
    await this.item.apply(this.actor, this);
  }
}

export default abstract class AbstractPotion
  extends ItemBase<"potion">
  implements PotionItem
{
  constructor(
    g: Engine,
    name: string,
    public rarity: ItemRarity,
    public status: ImplementationStatus = "missing",
    public description?: Description,
    iconUrl?: Url,
  ) {
    super(g, "potion", name, 0, iconUrl);

    g.events.on("GetActions", ({ detail: { who, actions } }) => {
      if (who.inventory.has(this)) actions.push(this.getDrinkAction(who));
      // TODO use on ally action
    });
  }

  getDrinkAction(actor: Combatant) {
    return new DrinkAction(this.g, actor, this);
  }

  abstract apply(actor: Combatant, action: DrinkAction): Promise<void>;
}
