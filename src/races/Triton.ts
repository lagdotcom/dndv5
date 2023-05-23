import CastSpell from "../actions/CastSpell";
import Engine from "../Engine";
import { darkvisionFeature, notImplementedFeature } from "../features/common";
import SimpleFeature from "../features/SimpleFeature";
import { LongRestResource } from "../resources";
import InnateSpellcasting from "../spells/InnateSpellcasting";
import FogCloud from "../spells/level1/FogCloud";
import GustOfWind from "../spells/level2/GustOfWind";
import WallOfWater from "../spells/level3/WallOfWater";
import Combatant from "../types/Combatant";
import PCRace from "../types/PCRace";
import Resource from "../types/Resource";
import Spell from "../types/Spell";
import SpellcastingMethod from "../types/SpellcastingMethod";

// TODO You can breathe air and water.
const Amphibious = notImplementedFeature("Amphibious");

const ControlAirAndWaterSpells = [
  {
    level: 1,
    spell: FogCloud,
    resource: new LongRestResource("Control Air and Water: Fog Cloud", 1),
  },
  {
    level: 3,
    spell: GustOfWind,
    resource: new LongRestResource("Control Air and Water: Gust of Wind", 1),
  },
  {
    level: 5,
    spell: WallOfWater,
    resource: new LongRestResource("Control Air and Water: Wall of Water", 1),
  },
];

class ControlAirAndWaterSpellAction<T extends object> extends CastSpell<T> {
  constructor(
    g: Engine,
    who: Combatant,
    method: SpellcastingMethod,
    spell: Spell<T>,
    public resource: Resource
  ) {
    super(g, who, method, spell);
  }

  // TODO check has resource before allowing cast

  async apply(config: T): Promise<void> {
    this.actor.spendResource(this.resource);

    return super.apply(config);
  }
}

const ControlAirAndWater = new SimpleFeature(
  "Control Air and Water",
  (g, me) => {
    const method = new InnateSpellcasting("Control Air and Water", "cha");
    const spells = ControlAirAndWaterSpells.filter(
      (entry) => entry.level <= me.level
    );
    for (const { resource } of spells) me.addResource(resource);

    g.events.on("getActions", ({ detail: { who, actions } }) => {
      if (who === me)
        for (const { spell, resource } of spells)
          actions.push(
            new ControlAirAndWaterSpellAction(
              g,
              me,
              method,
              new spell(g),
              resource
            )
          );
    });
  }
);

const Darkvision = darkvisionFeature();

// TODO Aquatic beasts have an extraordinary affinity with your people. You can communicate simple ideas with beasts that can breathe water. They can understand the meaning of your words, though you have no special ability to understand them in return.
const EmissaryOfTheSea = notImplementedFeature("Emissary of the Sea");

const GuardiansOfTheDepths = new SimpleFeature(
  "Guardians of the Depths",
  (g, me) => {
    g.events.on(
      "getDamageResponse",
      ({ detail: { who, damageType, response: result } }) => {
        if (who === me && damageType === "cold")
          result.add("resist", GuardiansOfTheDepths);
      }
    );
  }
);

const Triton: PCRace = {
  name: "Triton",
  size: "medium",
  abilities: new Map([
    ["str", 1],
    ["con", 1],
    ["cha", 1],
  ]),
  movement: new Map([
    ["speed", 30],
    ["swim", 30],
  ]),
  languages: new Set(["Common", "Primordial"]),
  features: new Set([
    Amphibious,
    ControlAirAndWater,
    Darkvision,
    EmissaryOfTheSea,
    GuardiansOfTheDepths,
  ]),
};
export default Triton;
