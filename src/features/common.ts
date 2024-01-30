import CastSpell from "../actions/CastSpell";
import allFeatures, { FeatureName } from "../data/allFeatures";
import allSpells, { SpellName } from "../data/allSpells";
import Engine from "../Engine";
import { Description, Feet, PCClassLevel, PCLevel } from "../flavours";
import { spellImplementationWarning } from "../spells/common";
import Combatant from "../types/Combatant";
import PCClassName from "../types/PCClassName";
import Resource from "../types/Resource";
import Spell, { SpellList } from "../types/Spell";
import SpellcastingMethod from "../types/SpellcastingMethod";
import { implementationWarning } from "../utils/env";
import ConfiguredFeature from "./ConfiguredFeature";
import SimpleFeature from "./SimpleFeature";

// TODO [TERRAIN] [CHOKING]
export const Amphibious = notImplementedFeature(
  "Amphibious",
  `You can breathe air and water.`,
);

export interface BonusSpellEntry<T extends number> {
  level: T;
  resource?: Resource;
  spell: SpellName;
}

export const bonusSpellResourceFinder =
  <T extends number>(entries: BonusSpellEntry<T>[]) =>
  (spell: Spell) =>
    entries.find((entry) => entry.spell === spell.name)?.resource;

export function bonusSpellsFeature(
  name: string,
  text: Description,
  levelType: "level",
  method: SpellcastingMethod,
  entries: BonusSpellEntry<PCLevel>[],
  addAsList?: SpellList,
  additionalSetup?: (g: Engine, me: Combatant) => void,
): SimpleFeature;
export function bonusSpellsFeature(
  name: string,
  text: Description,
  levelType: PCClassName,
  method: SpellcastingMethod,
  entries: BonusSpellEntry<PCClassLevel>[],
  addAsList?: SpellList,
  additionalSetup?: (g: Engine, me: Combatant) => void,
): SimpleFeature;
export function bonusSpellsFeature<T extends PCClassLevel | PCLevel>(
  name: string,
  text: Description,
  levelType: PCClassName | "level",
  method: SpellcastingMethod,
  entries: BonusSpellEntry<T>[],
  addAsList?: SpellList,
  additionalSetup?: (g: Engine, me: Combatant) => void,
) {
  return new SimpleFeature(name, text, (g, me) => {
    const casterLevel =
      levelType === "level" ? me.level : me.getClassLevel(levelType, 1);

    const activeEntries = entries.filter((entry) => entry.level <= casterLevel);
    const spells = new Set<Spell>();
    for (const { resource, spell: name } of activeEntries) {
      if (resource) me.initResource(resource);

      const spell = allSpells[name];
      spellImplementationWarning(spell ?? { name, status: "missing" }, me);
      if (!spell) continue;

      if (addAsList) {
        me.preparedSpells.add(spell);
        method.addCastableSpell?.(spell, me);
      } else spells.add(spell);
    }

    me.spellcastingMethods.add(method);

    if (spells.size)
      g.events.on("GetActions", ({ detail: { who, actions } }) => {
        if (who === me)
          for (const spell of spells)
            actions.push(new CastSpell(g, me, method, spell));
      });

    additionalSetup?.(g, me);
  });
}

export const Brave = new SimpleFeature(
  "Brave",
  `You have advantage on saving throws against being frightened.`,
  (g, me) => {
    g.events.on("BeforeSave", ({ detail: { who, tags, config, diceType } }) => {
      if (
        who === me &&
        (tags.has("frightened") || config?.conditions?.has("Frightened"))
      )
        diceType.add("advantage", Brave);
    });
  },
);

function darkvisionFeature(range: Feet = 60) {
  return new SimpleFeature(
    "Darkvision",
    `You can see in dim light within ${range} feet of you as if it were bright light and in darkness as if it were dim light. You can’t discern color in darkness, only shades of gray.`,
    (g, me) => {
      me.senses.set("darkvision", range);
    },
  );
}
export const Darkvision60 = darkvisionFeature(60);
export const Darkvision120 = darkvisionFeature(120);

export function nonCombatFeature(name: string, text: Description) {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  return new SimpleFeature(name, text, () => {});
}

export function notImplementedFeat(name: string, text: Description) {
  return new SimpleFeature(name, text, (g, me) => {
    implementationWarning("Feat", "Missing", name, me.name);
  });
}

export function notImplementedFeature(name: string, text: Description) {
  return new SimpleFeature(name, text, (g, me) => {
    implementationWarning("Feature", "Missing", name, me.name);
  });
}

export function wrapperFeature(name: string, text: Description) {
  return new ConfiguredFeature<FeatureName>(name, text, (g, me, feature) => {
    me.addFeature(allFeatures[feature]);
  });
}
