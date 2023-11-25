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
  }
}
