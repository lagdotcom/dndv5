import Engine from "../Engine";
import { ArmorCategory, ArmorItem } from "../types/Item";
import ItemBase from "./ItemBase";

export default class ArmorBase extends ItemBase<"armor"> implements ArmorItem {
  constructor(
    g: Engine,
    name: string,
    public category: ArmorCategory,
    public ac: number,
    public metal: boolean,
    public stealthDisadvantage = false,
    public minimumStrength = 0,
    iconUrl?: string,
  ) {
    super(g, "armor", name, 0, iconUrl);
  }
}
