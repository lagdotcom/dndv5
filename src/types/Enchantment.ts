import Engine from "../Engine";
import { ItemByTypeKey, ItemType } from "./Item";
import Source from "./Source";

export default interface Enchantment<T extends ItemType> extends Source {
  setup(g: Engine, item: ItemByTypeKey[T]): void;
}
