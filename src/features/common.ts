import CastSpell from "../actions/CastSpell";
import { spellImplementationWarning } from "../spells/common";
import Feature from "../types/Feature";
import PCClassName from "../types/PCClassName";
import Resource from "../types/Resource";
import Spell, { SpellList } from "../types/Spell";
import SpellcastingMethod from "../types/SpellcastingMethod";
import { getExecutionMode } from "../utils/env";
import ConfiguredFeature from "./ConfiguredFeature";
import SimpleFeature from "./SimpleFeature";

export type BonusSpellEntry = {
  level: number;
  resource?: Resource;
  spell: Spell;
};

export function bonusSpellsFeature(
  name: string,
  text: string,
  levelType: PCClassName | "level",
  method: SpellcastingMethod,
  entries: BonusSpellEntry[],
  addAsList?: SpellList,
) {
  return new SimpleFeature(name, text, (g, me) => {
    const casterLevel =
      levelType === "level" ? me.level : me.classLevels.get(levelType) ?? 1;

    const spells = entries.filter((entry) => entry.level <= casterLevel);
    for (const { resource, spell } of spells) {
      if (resource) me.initResource(resource);
      if (addAsList) {
        me.preparedSpells.add(spell);
        method.addCastableSpell?.(spell, me);
      } else spellImplementationWarning(spell, me);
    }

    me.spellcastingMethods.add(method);

    if (!addAsList)
      g.events.on("GetActions", ({ detail: { who, actions } }) => {
        if (who === me)
          for (const { spell } of spells)
            actions.push(new CastSpell(g, me, method, spell));
      });
  });
}

function darkvisionFeature(range = 60) {
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

export function nonCombatFeature(name: string, text: string) {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  return new SimpleFeature(name, text, () => {});
}

export function notImplementedFeat(name: string, text: string) {
  return new SimpleFeature(name, text, (g, me) => {
    if (getExecutionMode() !== "test")
      console.warn(`[Feat Missing] ${name} (on ${me.name})`);
  });
}

export function notImplementedFeature(name: string, text: string) {
  return new SimpleFeature(name, text, (g, me) => {
    if (getExecutionMode() !== "test")
      console.warn(`[Feature Missing] ${name} (on ${me.name})`);
  });
}

export function wrapperFeature(name: string, text: string) {
  return new ConfiguredFeature<Feature>(name, text, (g, me, style) => {
    me.addFeature(style);
  });
}
