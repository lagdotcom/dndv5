import Engine from "../../Engine";
import { isEquipmentAttuned } from "../../utils/items";
import AbstractWondrous from "../AbstractWondrous";

const DragonTouchedLevels = [
  "Slumbering",
  "Stirring",
  "Wakened",
  "Ascendant",
] as const;
type DragonTouchedLevel = (typeof DragonTouchedLevels)[number];
export default class DragonTouchedFocus extends AbstractWondrous {
  constructor(g: Engine, level: DragonTouchedLevel) {
    super(g, `Dragon-Touched Focus (${level})`, 1);
    this.attunement = true;

    this.rarity = "Uncommon";
    // TODO [FOCUS] While you are holding the focus, it can function as a spellcasting focus for all your spells.
    g.events.on("GetInitiative", ({ detail: { who, diceType } }) => {
      if (isEquipmentAttuned(this, who)) diceType.add("advantage", this);
    });

    /* TODO The focus gains an additional property determined by the family of the dragon in whose hoard it became Stirring:

Chromatic. Whenever you use a spell slot to cast a spell that deals acid, cold, fire, lightning, or poison damage, roll a d6, and you gain a bonus equal to the number rolled to one of the spell's damage rolls.

Gem. Whenever you use a spell slot to cast a spell, you can immediately teleport to an unoccupied space you can see within 15 feet of you.

Metallic. When a creature you can see within 30 feet of you makes a saving throw, you can use your reaction to give that creature advantage on the saving throw. */

    /* TODO While you are holding a Wakened focus, you can use it to cast certain spells. Once the item is used to cast a given spell, it can't be used to cast that spell again until the next dawn. The spells are determined by the family of the dragon in whose hoard it became Wakened.

Chromatic. Hold monster, Rime's binding ice

Gem. Rary's telepathic bond, Raulothim's psychic lance

Metallic. Fizban's platinum shield, legend lore */

    // TODO When you cast a spell of 1st level or higher while holding this focus, you can treat the spell as if it were cast using a 9th-level spell slot. Once this property is used, it can't be used again until the next dawn.
  }
}
