import CastSpell from "../actions/CastSpell";
import Engine from "../Engine";
import { ItemRarity } from "../types/Item";
import Resource from "../types/Resource";
import Spell from "../types/Spell";
import SpellcastingMethod from "../types/SpellcastingMethod";
import { isEquipmentAttuned } from "../utils/items";
import WondrousItemBase from "./WondrousItemBase";

export default class WandBase extends WondrousItemBase {
  constructor(
    g: Engine,
    name: string,
    rarity: ItemRarity,
    public charges: number,
    public maxCharges: number,
    public resource: Resource,
    public spell: Spell,
    public saveDC: number,
    public method: SpellcastingMethod = {
      name,
      getResourceForSpell: () => resource,
      getSaveType: () => ({ type: "flat", dc: saveDC }),
    },
  ) {
    super(g, name, 1);
    this.attunement = true;
    this.rarity = rarity;

    g.events.on("GetActions", ({ detail: { who, actions } }) => {
      if (isEquipmentAttuned(this, who)) {
        who.initResource(resource, charges, maxCharges);
        actions.push(new CastSpell(g, who, method, spell));
      }
    });
  }
}
