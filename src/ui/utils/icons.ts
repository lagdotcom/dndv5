import Engine from "../../Engine";

export function getAllIcons(g: Engine) {
  const icons = new Set<string>();

  for (const [who] of g.combatants) {
    for (const item of who.inventory) if (item.iconUrl) icons.add(item.iconUrl);
    for (const item of who.equipment) if (item.iconUrl) icons.add(item.iconUrl);
    for (const item of who.knownSpells) if (item.icon) icons.add(item.icon.url);
    for (const item of who.preparedSpells)
      if (item.icon) icons.add(item.icon.url);
    for (const item of who.spellcastingMethods)
      if (item.icon) icons.add(item.icon.url);
  }

  return icons;
}
