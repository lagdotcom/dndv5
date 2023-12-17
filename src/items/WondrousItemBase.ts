import Engine from "../Engine";
import { WondrousItem } from "../types/Item";
import ItemBase from "./ItemBase";

export default class WondrousItemBase
  extends ItemBase<"wondrous">
  implements WondrousItem
{
  constructor(g: Engine, name: string, hands = 0, iconUrl?: string) {
    super(g, "wondrous", name, hands, iconUrl);
  }
}
