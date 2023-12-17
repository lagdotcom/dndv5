import Engine from "../Engine";
import { AmmoItem, AmmunitionTag } from "../types/Item";
import AbstractItem from "./AbstractItem";

export default class AbstractAmmo
  extends AbstractItem<"ammo">
  implements AmmoItem
{
  constructor(
    g: Engine,
    name: string,
    public ammunitionTag: AmmunitionTag,
    iconUrl?: string,
  ) {
    super(g, "ammo", name, 0, iconUrl);
  }
}
