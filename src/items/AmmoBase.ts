import Engine from "../Engine";
import { AmmoItem, AmmunitionTag } from "../types/Item";
import ItemBase from "./ItemBase";

export default class AmmoBase extends ItemBase<"ammo"> implements AmmoItem {
  constructor(
    g: Engine,
    name: string,
    public ammunitionTag: AmmunitionTag,
    iconUrl?: string,
  ) {
    super(g, "ammo", name, 0, iconUrl);
  }
}
