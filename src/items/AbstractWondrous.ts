import Engine from "../Engine";
import { WondrousItem } from "../types/Item";
import AbstractItem from "./AbstractItem";

export default class AbstractWondrous
  extends AbstractItem<"wondrous">
  implements WondrousItem
{
  constructor(g: Engine, name: string, hands = 0, iconUrl?: string) {
    super(g, "wondrous", name, hands, iconUrl);
  }
}
