import CastSpell from "../../actions/CastSpell";
import SimpleFeature from "../../features/SimpleFeature";
import {
  CombatantID,
  Description,
  PCClassLevel,
  SpellSlot,
} from "../../flavours";
import { ShortRestResource } from "../../resources";
import AbilityName from "../../types/AbilityName";
import Combatant from "../../types/Combatant";
import Feature from "../../types/Feature";
import Icon from "../../types/Icon";
import PCClassName from "../../types/PCClassName";
import SaveType from "../../types/SaveType";
import Spell, { SpellList } from "../../types/Spell";
import SpellcastingMethod from "../../types/SpellcastingMethod";

function getPactMagicLevel(level: PCClassLevel): SpellSlot {
  if (level < 3) return 1;
  if (level < 5) return 2;
  if (level < 7) return 3;
  if (level < 9) return 4;
  return 5;
}

function getPactMagicSlots(level: PCClassLevel) {
  if (level < 2) return 1;
  if (level < 11) return 2;
  if (level < 17) return 3;
  return 4;
}

const PactMagicResource = new ShortRestResource("Pact Magic", 1);

interface Entry {
  level: SpellSlot;
  spells: Set<Spell>;
}

export default class PactMagic implements SpellcastingMethod {
  entries: Map<CombatantID, Entry>;
  feature: Feature;

  constructor(
    public name: string,
    public text: Description,
    public ability: AbilityName,
    public className: PCClassName,
    public spellList: SpellList,
    public icon?: Icon,
  ) {
    this.entries = new Map();

    this.feature = new SimpleFeature(`Pact Magic ${name}`, text, (g, me) => {
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
    });
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

  addCastableSpell?(spell: Spell, caster: Combatant): void {
    const { spells } = this.getEntry(caster);
    spells.add(spell);
  }

  initialise(who: Combatant, casterLevel: PCClassLevel) {
    const level = getPactMagicLevel(casterLevel);
    const slots = getPactMagicSlots(casterLevel);

    who.initResource(PactMagicResource, slots);

    this.entries.set(who.id, { level, spells: new Set() });
  }

  getMinSlot?(spell: Spell, caster: Combatant): SpellSlot {
    if (spell.level === 0) return 0;
    return this.getEntry(caster).level as SpellSlot;
  }

  getMaxSlot?(spell: Spell, caster: Combatant): SpellSlot {
    if (spell.level === 0) return 0;
    return this.getEntry(caster).level as SpellSlot;
  }

  getResourceForSpell(spell: Spell<object>, slot: SpellSlot) {
    if (slot > 0) return PactMagicResource;
  }

  getSaveType(): SaveType {
    return { type: "ability", ability: this.ability };
  }
}
