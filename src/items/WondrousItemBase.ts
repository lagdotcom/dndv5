import Engine from "../Engine";
import { Hands, Url } from "../flavours";
import { WondrousItem } from "../types/Item";
import ItemBase from "./ItemBase";

export default class WondrousItemBase
  extends ItemBase<"wondrous">
  implements WondrousItem
{
  constructor(g: Engine, name: string, hands: Hands = 0, iconUrl?: Url) {
    super(g, "wondrous", name, hands, iconUrl);
  }
}
