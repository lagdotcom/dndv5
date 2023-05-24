import Engine from "../Engine";
import Item, { ItemByTypeKey } from "./Item";
import Source from "./Source";

export default interface Enchantment<T extends Item["itemType"]>
  extends Source {
  name: string;
  setup(g: Engine, item: ItemByTypeKey[T]): void;
}
