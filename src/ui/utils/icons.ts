import Engine from "../../Engine";
import Source from "../../types/Source";
import { isDefined } from "../../utils/types";

const getIconUrl = (item: Source) => item.icon && item.icon.url;

export function getAllIcons(g: Engine) {
  return new Set(
    Array.from(g.combatants.keys())
      .flatMap((who) => [
        ...who.inventory,
        ...who.equipment,
        ...who.knownSpells,
        ...who.preparedSpells,
        ...who.spellcastingMethods,
      ])
      .map(getIconUrl)
      .filter(isDefined),
  );
}
