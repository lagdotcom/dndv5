import CastSpell from "../actions/CastSpell";
import SimpleFeature from "../features/SimpleFeature";
import { LongRestResource } from "../resources";
import Ability from "../types/Ability";
import Combatant from "../types/Combatant";
import PCClassName from "../types/PCClassName";
import Resource from "../types/Resource";
import Spell, { SpellList } from "../types/Spell";
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

export function getMaxSpellSlotAvailable(who: Combatant) {
  for (let level = 1; level <= 9; level++) {
    const name = getSpellSlotResourceName(level);
    if (!who.resources.has(name)) return level - 1;
  }

  return 9;
}

interface Entry {
  resources: Resource[];
  spells: Set<Spell>;
}

export default class NormalSpellcasting implements SpellcastingMethod {
  entries: Map<Combatant, Entry>;
  feature: SimpleFeature;

  constructor(
    public name: string,
    public text: string,
    public ability: Ability,
    public strength: SpellcastingStrength,
    public className: PCClassName,
    public list: SpellList
  ) {
    this.entries = new Map();

    this.feature = new SimpleFeature("Spellcasting", text, (g, me) => {
      this.initialise(me, me.classLevels.get(className) ?? 1);

      g.events.on("getActions", ({ detail: { who, actions } }) => {
        if (who === me) {
          const { spells } = this.getEntry(who);

          // TODO rituals in knownSpells

          for (const spell of me.preparedSpells) {
            if (spell.lists.includes(list) || spells.has(spell))
              actions.push(new CastSpell(g, me, this, spell));
          }
        }
      });
    });
  }

  private getEntry(who: Combatant) {
    const entry = this.entries.get(who);
    if (!entry)
      throw new Error(
        `${who.name} has not initialised their ${this.name} spellcasting method.`
      );
    return entry;
  }

  addCastableSpell(spell: Spell<object>, caster: Combatant): void {
    const { spells } = this.getEntry(caster);
    spells.add(spell);
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

    this.entries.set(who, { resources, spells: new Set() });
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
