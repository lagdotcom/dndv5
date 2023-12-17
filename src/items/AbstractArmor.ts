import Engine from "../Engine";
import { ArmorCategory, ArmorItem } from "../types/Item";
import AbstractItem from "./AbstractItem";

export default abstract class AbstractArmor
  extends AbstractItem<"armor">
  implements ArmorItem
{
  constructor(
    g: Engine,
    name: string,
    public category: ArmorCategory,
    public ac: number,
    public stealthDisadvantage = false,
    public minimumStrength = 0,
    iconUrl?: string,
  ) {
    super(g, "armor", name, 0, iconUrl);
  }
}
