import { LongRestResource } from "../resources";
import Ability from "../types/Ability";
import Combatant from "../types/Combatant";
import Resource from "../types/Resource";
import Spell from "../types/Spell";
import SpellcastingMethod from "../types/SpellcastingMethod";

type SpellcastingStrength = "full" | "half";

const SpellSlots = {
  full: [
    [2],
    [3],
    [4, 2],
    [4, 3],
    [4, 3, 2],
    [4, 3, 3],
    [4, 3, 3, 1],
    [4, 3, 3, 2],
    [4, 3, 3, 3, 1],
    [4, 3, 3, 3, 2],
    [4, 3, 3, 3, 2, 1],
    [4, 3, 3, 3, 2, 1],
    [4, 3, 3, 3, 2, 1, 1],
    [4, 3, 3, 3, 2, 1, 1],
    [4, 3, 3, 3, 2, 1, 1, 1],
    [4, 3, 3, 3, 2, 1, 1, 1],
    [4, 3, 3, 3, 2, 1, 1, 1, 1],
    [4, 3, 3, 3, 3, 1, 1, 1, 1],
    [4, 3, 3, 3, 3, 2, 1, 1, 1],
    [4, 3, 3, 3, 3, 2, 2, 1, 1],
  ],
  half: [
    [],
    [2],
    [3],
    [4],
    [4, 2],
    [4, 2],
    [4, 3],
    [4, 3],
    [4, 3, 2],
    [4, 3, 2],
    [4, 3, 3],
    [4, 3, 3],
    [4, 3, 3, 1],
    [4, 3, 3, 1],
    [4, 3, 3, 2],
    [4, 3, 3, 2],
    [4, 3, 3, 3, 1],
    [4, 3, 3, 3, 1],
    [4, 3, 3, 3, 2],
    [4, 3, 3, 3, 2],
  ],
};

export const getSpellSlotResourceName = (level: number) =>
  `Spell Slot (${level})` as const;

interface Entry {
  resources: Resource[];
}

export default class NormalSpellcasting implements SpellcastingMethod {
  entries: Map<Combatant, Entry>;

  constructor(
    public name: string,
    public ability: Ability,
    public strength: SpellcastingStrength
  ) {
    this.entries = new Map();
  }

  private getEntry(who: Combatant) {
    const entry = this.entries.get(who);
    if (!entry)
      throw new Error(
        `${who.name} has not initialised their ${this.name} spellcasting method.`
      );
    return entry;
  }

  initialise(who: Combatant, casterLevel: number) {
    const slots = SpellSlots[this.strength][casterLevel - 1];
    const resources: Resource[] = [];

    for (let i = 0; i < slots.length; i++) {
      const resource = new LongRestResource(
        getSpellSlotResourceName(i + 1),
        slots[i]
      );
      who.addResource(resource);

      resources.push(resource);
    }

    this.entries.set(who, { resources });
  }

  getMinSlot(spell: Spell) {
    return spell.level;
  }

  getMaxSlot(spell: Spell, who: Combatant) {
    if (!spell.scaling) return spell.level;

    const { resources } = this.getEntry(who);
    return resources.length;
  }

  getResourceForSpell(spell: Spell, level: number, who: Combatant) {
    const { resources } = this.getEntry(who);
    return resources[level - 1];
  }
}
