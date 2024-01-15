import { Quantity } from "../flavours";
import { EnchantmentName } from "./allEnchantments";
import { ItemName } from "./allItems";

export default interface InventoryItem {
  name: ItemName;
  equip?: boolean;
  attune?: boolean;
  quantity?: Quantity;
  enchantments?: EnchantmentName[];
}
