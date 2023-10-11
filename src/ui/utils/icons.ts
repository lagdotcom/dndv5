import Engine from "../../Engine";
import Source from "../../types/Source";
import { isDefined } from "../../utils/types";

export function getAllIcons(g: Engine) {
  const getIconUrl = (item: Source) => item.icon && item.icon.url;

  const relevantItems = Array.from(g.combatants.keys()).flatMap((who) => [
    ...who.inventory,
    ...who.equipment,
    ...who.knownSpells,
    ...who.preparedSpells,
    ...who.spellcastingMethods,
  ]);

  return new Set(relevantItems.map(getIconUrl).filter(isDefined));
}
