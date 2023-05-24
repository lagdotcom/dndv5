import CastSpell from "../actions/CastSpell";
import { darkvisionFeature, notImplementedFeature } from "../features/common";
import SimpleFeature from "../features/SimpleFeature";
import { LongRestResource } from "../resources";
import InnateSpellcasting from "../spells/InnateSpellcasting";
import FogCloud from "../spells/level1/FogCloud";
import GustOfWind from "../spells/level2/GustOfWind";
import WallOfWater from "../spells/level3/WallOfWater";
import PCRace from "../types/PCRace";

// TODO You can breathe air and water.
const Amphibious = notImplementedFeature("Amphibious");

const FogCloudResource = new LongRestResource(
  "Control Air and Water: Fog Cloud",
  1
);
const GustOfWindResource = new LongRestResource(
  "Control Air and Water: Gust of Wind",
  1
);
const WallOfWaterResource = new LongRestResource(
  "Control Air and Water: Wall of Water",
  1
);

const ControlAirAndWaterSpells = [
  { level: 1, spell: FogCloud, resource: FogCloudResource },
  { level: 3, spell: GustOfWind, resource: GustOfWindResource },
  { level: 5, spell: WallOfWater, resource: WallOfWaterResource },
];

const ControlAirAndWaterMethod = new InnateSpellcasting(
  "Control Air and Water",
  "cha",
  (spell) => {
    if (spell instanceof FogCloud) return FogCloudResource;
    if (spell instanceof GustOfWind) return GustOfWindResource;
    if (spell instanceof WallOfWater) return WallOfWaterResource;
  }
);

const ControlAirAndWater = new SimpleFeature(
  "Control Air and Water",
  (g, me) => {
    const spells = ControlAirAndWaterSpells.filter(
      (entry) => entry.level <= me.level
    );
    for (const { resource } of spells) me.addResource(resource);

    g.events.on("getActions", ({ detail: { who, actions } }) => {
      if (who === me)
        for (const { spell } of spells)
          actions.push(
            new CastSpell(g, me, ControlAirAndWaterMethod, new spell(g))
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
