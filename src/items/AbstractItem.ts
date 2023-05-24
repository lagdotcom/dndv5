import Engine from "../Engine";
import Enchantment from "../types/Enchantment";
import Item, { ItemByTypeKey } from "../types/Item";

export default abstract class AbstractItem<T extends Item["itemType"]> {
  enchantments: Set<Enchantment<T>>;

  constructor(
    public g: Engine,
    public itemType: T,
    public name: string,
    public hands = 0
  ) {
    this.enchantments = new Set();
  }

  addEnchantment(e: Enchantment<T>) {
    this.enchantments.add(e);
    e.setup(this.g, this as unknown as ItemByTypeKey[T]);
  }
}
