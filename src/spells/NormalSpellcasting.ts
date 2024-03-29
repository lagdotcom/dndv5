import CastSpell from "../actions/CastSpell";
import SimpleFeature from "../features/SimpleFeature";
import { CombatantID, Description, PCClassLevel, SpellSlot } from "../flavours";
import { LongRestResource } from "../resources";
import AbilityName from "../types/AbilityName";
import Combatant from "../types/Combatant";
import Icon from "../types/Icon";
import PCClassName from "../types/PCClassName";
import Resource from "../types/Resource";
import SaveType from "../types/SaveType";
import Spell, { SpellList } from "../types/Spell";
import SpellcastingMethod from "../types/SpellcastingMethod";
import { enumerate } from "../utils/numbers";

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

export const getSpellSlotResourceName = (slot: SpellSlot) =>
  `Spell Slot (${slot})` as const;

export const SpellSlotResources = enumerate(0, 9).map(
  (slot) => new LongRestResource(getSpellSlotResourceName(slot), 0),
);

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

// TODO multiclass spellcasting is weird
export default class NormalSpellcasting implements SpellcastingMethod {
  entries: Map<CombatantID, Entry>;
  feature: SimpleFeature;

  constructor(
    public name: string,
    public text: Description,
    public ability: AbilityName,
    public strength: SpellcastingStrength,
    public className: PCClassName,
    public spellList: SpellList,
    public icon?: Icon,
  ) {
    this.entries = new Map();

    this.feature = new SimpleFeature(
      `Spellcasting (${name})`,
      text,
      (g, me) => {
        this.initialise(me, me.getClassLevel(className, 1));
        me.spellcastingMethods.add(this);

        g.events.on("GetActions", ({ detail: { who, actions } }) => {
          if (who === me) {
            // TODO [RITUAL]

            for (const spell of me.preparedSpells) {
              if (this.canCast(spell, who))
                actions.push(new CastSpell(g, me, this, spell));
            }
          }
        });
      },
    );
  }

  private getEntry(who: Combatant) {
    const entry = this.entries.get(who.id);
    if (!entry)
      throw new Error(
        `${who.name} has not initialised their ${this.name} spellcasting method.`,
      );
    return entry;
  }

  canCast(spell: Spell, caster: Combatant) {
    const { spells } = this.getEntry(caster);
    return spell.lists.includes(this.spellList) || spells.has(spell);
  }

  addCastableSpell(spell: Spell, caster: Combatant) {
    const { spells } = this.getEntry(caster);
    spells.add(spell);
  }

  initialise(who: Combatant, casterLevel: PCClassLevel) {
    const slots = SpellSlots[this.strength][casterLevel - 1];
    const resources: Resource[] = [];

    for (let i = 0; i < slots.length; i++) {
      const resource = SpellSlotResources[i + 1];
      who.initResource(resource, slots[i]);
      resources.push(resource);
    }

    this.entries.set(who.id, { resources, spells: new Set() });
  }

  getMinSlot(spell: Spell) {
    return spell.level as SpellSlot;
  }

  getMaxSlot(spell: Spell, who: Combatant) {
    if (!spell.scaling) return spell.level as SpellSlot;

    const { resources } = this.getEntry(who);
    return resources.length as SpellSlot;
  }

  getResourceForSpell(spell: Spell, slot: SpellSlot, who: Combatant) {
    const { resources } = this.getEntry(who);
    return resources[slot - 1];
  }

  getSaveType(): SaveType {
    return { type: "ability", ability: this.ability };
  }
}
