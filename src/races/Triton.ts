import CastSpell from "../actions/CastSpell";
import {
  darkvisionFeature,
  nonCombatFeature,
  notImplementedFeature,
} from "../features/common";
import SimpleFeature from "../features/SimpleFeature";
import { LongRestResource } from "../resources";
import InnateSpellcasting from "../spells/InnateSpellcasting";
import FogCloud from "../spells/level1/FogCloud";
import GustOfWind from "../spells/level2/GustOfWind";
import WallOfWater from "../spells/level3/WallOfWater";
import PCRace from "../types/PCRace";

// TODO
const Amphibious = notImplementedFeature(
  "Amphibious",
  `You can breathe air and water.`
);

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
  `You can cast fog cloud with this trait. Starting at 3rd level, you can cast gust of wind with it, and starting at 5th level, you can also cast wall of water with it. Once you cast a spell with this trait, you can’t cast that spell with it again until you finish a long rest. Charisma is your spellcasting ability for these spells.`,
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

const EmissaryOfTheSea = nonCombatFeature(
  "Emissary of the Sea",
  `Aquatic beasts have an extraordinary affinity with your people. You can communicate simple ideas with beasts that can breathe water. They can understand the meaning of your words, though you have no special ability to understand them in return.`
);

const GuardiansOfTheDepths = new SimpleFeature(
  "Guardians of the Depths",
  `Adapted to even the most extreme ocean depths, you have resistance to cold damage.`,
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
