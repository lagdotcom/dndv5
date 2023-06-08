import Engine from "../Engine";
import Enchantment from "../types/Enchantment";
import { ItemByTypeKey, ItemRarity, ItemType } from "../types/Item";

export default abstract class AbstractItem<T extends ItemType> {
  attunement?: boolean;
  magic?: boolean;
  enchantments: Set<Enchantment<T>>;
  rarity: ItemRarity;
  iconUrl?: string;

  constructor(
    public g: Engine,
    public itemType: T,
    public name: string,
    public hands = 0
  ) {
    this.enchantments = new Set();
    this.rarity = "Common";
  }

  addEnchantment(e: Enchantment<T>) {
    this.enchantments.add(e);
    e.setup(this.g, this as unknown as ItemByTypeKey[T]);
  }
}
