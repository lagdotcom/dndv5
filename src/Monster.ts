import AbstractCombatant from "./AbstractCombatant";
import Engine from "./Engine";
import CreatureType from "./types/CreatureType";
import SizeCategory from "./types/SizeCategory";

export default class Monster extends AbstractCombatant {
  constructor(
    g: Engine,
    name: string,
    type: CreatureType,
    size: SizeCategory,
    img: string
  ) {
    super(g, name, type, size, img, 1, true);
  }
}
