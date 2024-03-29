import { ItemRarityColours } from "../colours";
import Engine from "../Engine";
import { Hands, Url } from "../flavours";
import Combatant from "../types/Combatant";
import Enchantment from "../types/Enchantment";
import Icon from "../types/Icon";
import { ItemByTypeKey, ItemRarity, ItemType } from "../types/Item";
import Source from "../types/Source";

export default class ItemBase<T extends ItemType> implements Source {
  attunement?: boolean;
  magic?: boolean;
  enchantments: Set<Enchantment<T>>;
  rarity: ItemRarity;
  owner?: Combatant;
  possessor?: Combatant;

  constructor(
    public g: Engine,
    public itemType: T,
    public name: string,
    public hands: Hands = 0,
    private iconUrl?: Url,
  ) {
    this.enchantments = new Set();
    this.rarity = "Common";
  }

  get icon(): Icon | undefined {
    if (this.iconUrl)
      return { url: this.iconUrl, colour: ItemRarityColours[this.rarity] };
  }

  addEnchantment(e: Enchantment<T>) {
    this.enchantments.add(e);
    e.setup(this.g, this as unknown as ItemByTypeKey[T]);

    return this;
  }
}
