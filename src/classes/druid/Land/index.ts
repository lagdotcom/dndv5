import {
  BonusSpellEntry,
  bonusSpellsFeature,
  nonCombatFeature,
  notImplementedFeature,
} from "../../../features/common";
import ConfiguredFeature from "../../../features/ConfiguredFeature";
import Blur from "../../../spells/level2/Blur";
import HoldPerson from "../../../spells/level2/HoldPerson";
import MirrorImage from "../../../spells/level2/MirrorImage";
import MistyStep from "../../../spells/level2/MistyStep";
import Silence from "../../../spells/level2/Silence";
import SpiderClimb from "../../../spells/level2/SpiderClimb";
import SpikeGrowth from "../../../spells/level2/SpikeGrowth";
import LightningBolt from "../../../spells/level3/LightningBolt";
import MeldIntoStone from "../../../spells/level3/MeldIntoStone";
import SleetStorm from "../../../spells/level3/SleetStorm";
import Slow from "../../../spells/level3/Slow";
import WaterBreathing from "../../../spells/level3/WaterBreathing";
import WaterWalk from "../../../spells/level3/WaterWalk";
import ControlWater from "../../../spells/level4/ControlWater";
import FreedomOfMovement from "../../../spells/level4/FreedomOfMovement";
import IceStorm from "../../../spells/level4/IceStorm";
import StoneShape from "../../../spells/level4/StoneShape";
import Stoneskin from "../../../spells/level4/Stoneskin";
import CommuneWithNature from "../../../spells/level5/CommuneWithNature";
import ConeOfCold from "../../../spells/level5/ConeOfCold";
import ConjureElemental from "../../../spells/level5/ConjureElemental";
import PCSubclass from "../../../types/PCSubclass";
import Spell from "../../../types/Spell";
import { DruidSpellcasting } from "..";

export const BonusCantrip = new ConfiguredFeature<Spell>(
  "Bonus Cantrip",
  `You learn one additional druid cantrip of your choice. This cantrip doesn't count against the number of druid cantrips you know.`,
  (g, me, spell) => {
    me.preparedSpells.add(spell);
  }
);

const NaturalRecovery = nonCombatFeature(
  "Natural Recovery",
  `Starting at 2nd level, you can regain some of your magical energy by sitting in meditation and communing with nature. During a short rest, you choose expended spell slots to recover. The spell slots can have a combined level that is equal to or less than half your druid level (rounded up), and none of the slots can be 6th level or higher. You can't use this feature again until you finish a long rest.

For example, when you are a 4th-level druid, you can recover up to two levels worth of spell slots. You can recover either a 2nd-level slot or two 1st-level slots.`
);

type LandType =
  | "arctic"
  | "coast"
  | "desert"
  | "forest"
  | "grassland"
  | "mountain"
  | "swamp"
  | "Underdark";

const bonusSpells: Record<LandType, BonusSpellEntry[]> = {
  arctic: [
    { level: 3, spell: HoldPerson },
    { level: 3, spell: SpikeGrowth },
    { level: 5, spell: SleetStorm },
    { level: 5, spell: Slow },
    { level: 7, spell: FreedomOfMovement },
    { level: 7, spell: IceStorm },
    { level: 9, spell: CommuneWithNature },
    { level: 9, spell: ConeOfCold },
  ],
  coast: [
    { level: 3, spell: MirrorImage },
    { level: 3, spell: MistyStep },
    { level: 5, spell: WaterBreathing },
    { level: 5, spell: WaterWalk },
    { level: 7, spell: ControlWater },
    { level: 7, spell: FreedomOfMovement },
    { level: 9, spell: ConjureElemental },
    // { level: 9, spell: Scrying },
  ],
  desert: [
    { level: 3, spell: Blur },
    { level: 3, spell: Silence },
    // { level: 5, spell: CreateFoodAndWater },
    // { level: 5, spell: ProtectionFromEnergy },
    // { level: 7, spell: Blight },
    // { level: 7, spell: HallucinatoryTerrain },
    // { level: 9, spell: InsectPlague },
    // { level: 9, spell: WallOfStone },
  ],
  forest: [
    // { level: 3, spell: Barkskin },
    { level: 3, spell: SpiderClimb },
    // { level: 5, spell: CallLightning },
    // { level: 5, spell: PlantGrowth },
    // { level: 7, spell: Divination },
    { level: 7, spell: FreedomOfMovement },
    { level: 9, spell: CommuneWithNature },
    // { level: 9, spell: TreeStride },
  ],
  grassland: [
    // { level: 3, spell: Invisibility },
    // { level: 3, spell: PassWithoutTrade },
    // { level: 5, spell: Daylight },
    // { level: 5, spell: Haste },
    // { level: 7, spell: Divination },
    { level: 7, spell: FreedomOfMovement },
    // { level: 9, spell: Dream },
    // { level: 9, spell: InsectPlague },
  ],
  mountain: [
    { level: 3, spell: SpiderClimb },
    { level: 3, spell: SpikeGrowth },
    { level: 5, spell: LightningBolt },
    { level: 5, spell: MeldIntoStone },
    { level: 7, spell: StoneShape },
    { level: 7, spell: Stoneskin },
    // { level: 9, spell: Passwall },
    // { level: 9, spell: WallOfStone },
  ],
  swamp: [
    // { level: 3, spell: Darkness },
    // { level: 3, spell: MelfsAcidArrow },
    { level: 5, spell: WaterWalk },
    // { level: 5, spell: StinkingCloud },
    { level: 7, spell: FreedomOfMovement },
    // { level: 7, spell: LocateCreature },
    // { level: 9, spell: InsectPlague },
    // { level: 9, spell: Scrying },
  ],
  Underdark: [
    { level: 3, spell: SpiderClimb },
    // { level: 3, spell: Web },
    // { level: 5, spell: GaseousForm },
    // { level: 5, spell: StinkingCloud },
    // { level: 7, spell: GreaterInvisibility },
    // { level: 7, spell: StoneShape },
    // { level: 9, spell: Cloudkill },
    // { level: 9, spell: InsectPlague },
  ],
};

const bonusSpellsFeatures = new Map(
  Object.entries(bonusSpells).map(([type, entries]) => [
    type as LandType,
    bonusSpellsFeature(
      "Circle Spells",
      `Your mystical connection to the land infuses you with the ability to cast certain spells.`,
      "Druid",
      DruidSpellcasting,
      entries,
      "Druid"
    ),
  ])
);

export const CircleSpells = new ConfiguredFeature<LandType>(
  "Circle Spells",
  `Your mystical connection to the land infuses you with the ability to cast certain spells. At 3rd, 5th, 7th, and 9th level you gain access to circle spells connected to the land where you became a druid. Choose that land—arctic, coast, desert, forest, grassland, mountain, swamp, or Underdark—and consult the associated list of spells.

Once you gain access to a circle spell, you always have it prepared, and it doesn't count against the number of spells you can prepare each day. If you gain access to a spell that doesn't appear on the druid spell list, the spell is nonetheless a druid spell for you.`,
  (g, me, type) => {
    const feature = bonusSpellsFeatures.get(type);
    feature?.setup(g, me);
  }
);

// TODO
const LandsStride = notImplementedFeature(
  "Land's Stride",
  `Starting at 6th level, moving through nonmagical difficult terrain costs you no extra movement. You can also pass through nonmagical plants without being slowed by them and without taking damage from them if they have thorns, spines, or a similar hazard.

In addition, you have advantage on saving throws against plants that are magically created or manipulated to impede movement, such as those created by the entangle spell.`
);

// TODO
const NaturesWard = notImplementedFeature(
  "Nature's Ward",
  `When you reach 10th level, you can't be charmed or frightened by elementals or fey, and you are immune to poison and disease.`
);

// TODO
const NaturesSanctuary = notImplementedFeature(
  "Nature's Sanctuary",
  `When you reach 14th level, creatures of the natural world sense your connection to nature and become hesitant to attack you. When a beast or plant creature attacks you, that creature must make a Wisdom saving throw against your druid spell save DC. On a failed save, the creature must choose a different target, or the attack automatically misses. On a successful save, the creature is immune to this effect for 24 hours.

The creature is aware of this effect before it makes its attack against you.`
);

const Land: PCSubclass = {
  className: "Druid",
  name: "Circle of the Land",
  features: new Map([
    [2, [BonusCantrip, NaturalRecovery, CircleSpells]],
    [6, [LandsStride]],
    [10, [NaturesWard]],
    [14, [NaturesSanctuary]],
  ]),
};
export default Land;
