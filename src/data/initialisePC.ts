import Engine from "../Engine";
import PC from "../PC";
import Enchantment from "../types/Enchantment";
import HasProficiency from "../types/HasProficiency";
import { ItemType } from "../types/Item";
import LanguageName from "../types/LanguageName";
import allBackgrounds from "./allBackgrounds";
import allEnchantments from "./allEnchantments";
import allFeatures from "./allFeatures";
import allItems from "./allItems";
import allPCClasses from "./allPCClasses";
import allPCRaces from "./allPCRaces";
import allPCSubclasses from "./allPCSubclasses";
import allSpells from "./allSpells";
import PCTemplate from "./PCTemplate";

export default function initialisePC(g: Engine, t: PCTemplate) {
  const pc = new PC(g, t.name, t.tokenUrl);
  const addConfigs = (list: Record<string, unknown> = {}) =>
    Object.entries(list).forEach(([key, value]) => pc.configs.set(key, value));
  const addLanguages = (list: LanguageName[] = []) =>
    list.forEach((lang) => pc.languages.add(lang));
  const addProfs = (list: HasProficiency[] = []) =>
    list.forEach((prof) => pc.addProficiency(prof, "proficient"));

  pc.setAbilityScores(...t.abilities);
  pc.setRace(allPCRaces[t.race.name]);
  for (const ability of t.race.abilities ?? []) pc[ability].score++;
  addConfigs(t.race.configs);
  addLanguages(t.race.languages);

  pc.setBackground(allBackgrounds[t.background.name]);
  addLanguages(t.background.languages);
  addProfs(t.background.proficiencies);

  for (const {
    class: cl,
    subclass,
    configs,
    hpRoll,
    proficiencies,
  } of t.levels) {
    if (subclass) {
      const sub = allPCSubclasses[subclass];
      if (sub.className !== cl)
        throw new Error(`Invalid subclass ${subclass} on class ${cl}`);
      pc.addSubclass(sub);
    }
    pc.addClassLevel(allPCClasses[cl], hpRoll);
    addProfs(proficiencies);
    addConfigs(configs);
  }

  addProfs(t.proficiencies);
  for (const feat of t.feats ?? []) pc.addFeature(allFeatures[feat]);
  addConfigs(t.configs);
  addLanguages(t.languages);

  for (const { name, equip, attune, enchantments, quantity } of t.items) {
    const item = allItems[name](g, quantity);
    if (attune) pc.attunements.add(item);

    for (const name of enchantments ?? []) {
      const enchantment = allEnchantments[name];
      item.addEnchantment(enchantment as Enchantment<ItemType>);
    }

    if (equip) pc.don(item);
    else pc.inventory.add(item);
  }

  for (const spell of t.known ?? []) pc.knownSpells.add(allSpells[spell]);
  for (const spell of t.prepared ?? []) {
    pc.knownSpells.add(allSpells[spell]);
    pc.preparedSpells.add(allSpells[spell]);
  }

  return pc;
}
