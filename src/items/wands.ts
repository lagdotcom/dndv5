import CastSpell from "../actions/CastSpell";
import Engine from "../Engine";
import { DawnResource } from "../resources";
import Web from "../spells/level2/Web";
import { ItemRarity } from "../types/Item";
import Resource from "../types/Resource";
import Spell from "../types/Spell";
import SpellcastingMethod from "../types/SpellcastingMethod";
import { AbstractWondrous } from "./wondrous";

class AbstractWand extends AbstractWondrous {
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
      getSaveDC: () => saveDC,
    },
  ) {
    super(g, name, 1);
    this.attunement = true;
    this.rarity = rarity;

    g.events.on("GetActions", ({ detail: { who, actions } }) => {
      if (who.equipment.has(this) && who.attunements.has(this)) {
        who.initResource(resource, charges, maxCharges);
        actions.push(new CastSpell(g, who, method, spell));
      }
    });
  }
}

export class WandOfWeb extends AbstractWand {
  constructor(g: Engine, charges = 7) {
    super(
      g,
      "Wand of Web",
      "Uncommon",
      charges,
      7,
      new DawnResource("charge", 7),
      Web,
      15,
    );
  }
}
