import allSpells, { SpellName } from "../../../data/allSpells";
import {
  BonusSpellEntry,
  bonusSpellsFeature,
  nonCombatFeature,
  notImplementedFeature,
} from "../../../features/common";
import ConfiguredFeature from "../../../features/ConfiguredFeature";
import SimpleFeature from "../../../features/SimpleFeature";
import { PCClassLevel } from "../../../flavours";
import { ctSet } from "../../../types/CreatureType";
import PCSubclass from "../../../types/PCSubclass";
import { objectEntries } from "../../../utils/objects";
import { hasAny } from "../../../utils/set";
import { makeLandsStride } from "../../common";
import { DruidSpellcasting } from "..";

export const BonusCantrip = new ConfiguredFeature<SpellName>(
  "Bonus Cantrip",
  `You learn one additional druid cantrip of your choice. This cantrip doesn't count against the number of druid cantrips you know.`,
  (g, me, spell) => {
    me.preparedSpells.add(allSpells[spell]);
  },
);

const NaturalRecovery = nonCombatFeature(
  "Natural Recovery",
  `Starting at 2nd level, you can regain some of your magical energy by sitting in meditation and communing with nature. During a short rest, you choose expended spell slots to recover. The spell slots can have a combined level that is equal to or less than half your druid level (rounded up), and none of the slots can be 6th level or higher. You can't use this feature again until you finish a long rest.

For example, when you are a 4th-level druid, you can recover up to two levels worth of spell slots. You can recover either a 2nd-level slot or two 1st-level slots.`,
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

const bonusSpells: Record<LandType, BonusSpellEntry<PCClassLevel>[]> = {
  arctic: [
    { level: 3, spell: "hold person" },
    { level: 3, spell: "spike growth" },
    { level: 5, spell: "sleet storm" },
    { level: 5, spell: "slow" },
    { level: 7, spell: "freedom of movement" },
    { level: 7, spell: "ice storm" },
    // { level: 9, spell: 'commune with nature' },
    { level: 9, spell: "cone of cold" },
  ],
  coast: [
    { level: 3, spell: "mirror image" },
    { level: 3, spell: "misty step" },
    { level: 5, spell: "water breathing" },
    { level: 5, spell: "water walk" },
    { level: 7, spell: "control water" },
    { level: 7, spell: "freedom of movement" },
    // { level: 9, spell: 'conjure elemental' },
    // { level: 9, spell: 'scrying' },
  ],
  desert: [
    { level: 3, spell: "blur" },
    { level: 3, spell: "silence" },
    // { level: 5, spell: 'create food and water' },
    // TODO { level: 5, spell: 'protection from energy' },
    // TODO { level: 7, spell: 'blight' },
    // { level: 7, spell: 'hallucinatory terrain' },
    // TODO { level: 9, spell: 'insect plague' },
    // TODO { level: 9, spell: 'wall of stone' },
  ],
  forest: [
    { level: 3, spell: "barkskin" },
    { level: 3, spell: "spider climb" },
    // TODO { level: 5, spell: 'call lightning' },
    // { level: 5, spell: 'plant growth' },
    // { level: 7, spell: 'divination' },
    { level: 7, spell: "freedom of movement" },
    // { level: 9, spell: 'commune with nature' },
    // { level: 9, spell: 'tree stride' },
  ],
  grassland: [
    // TODO { level: 3, spell: 'invisibility' },
    // { level: 3, spell: 'pass without trace' },
    // { level: 5, spell: 'daylight' },
    // TODO { level: 5, spell: 'haste' },
    // { level: 7, spell: 'divination' },
    { level: 7, spell: "freedom of movement" },
    // { level: 9, spell: 'dream' },
    // TODO { level: 9, spell: 'insect plague' },
  ],
  mountain: [
    { level: 3, spell: "spider climb" },
    { level: 3, spell: "spike growth" },
    { level: 5, spell: "lightning bolt" },
    { level: 5, spell: "meld into stone" },
    // { level: 7, spell: 'stone shape' },
    { level: 7, spell: "stoneskin" },
    // { level: 9, spell: 'passwall' },
    // { level: 9, spell: 'wall of stone' },
  ],
  swamp: [
    { level: 3, spell: "darkness" },
    // TODO { level: 3, spell: "melf's acid arrow" },
    { level: 5, spell: "water walk" },
    // TODO { level: 5, spell: 'stinking cloud' },
    { level: 7, spell: "freedom of movement" },
    // { level: 7, spell: 'locate creature' },
    // TODO { level: 9, spell: 'insect plague' },
    // { level: 9, spell: 'scrying' },
  ],
  Underdark: [
    { level: 3, spell: "spider climb" },
    { level: 3, spell: "web" },
    // { level: 5, spell: 'gaseous form' },
    // TODO { level: 5, spell: 'stinking cloud' },
    // TODO { level: 7, spell: 'greater invisibility' },
    // { level: 7, spell: 'stoneshape' },
    // TODO { level: 9, spell: 'cloudkill' },
    // TODO { level: 9, spell: 'insect plague' },
  ],
};

const bonusSpellsFeatures = new Map(
  objectEntries(bonusSpells).map(([type, entries]) => [
    type,
    bonusSpellsFeature(
      "Circle Spells",
      `Your mystical connection to the land infuses you with the ability to cast certain spells.`,
      "Druid",
      DruidSpellcasting,
      entries,
      "Druid",
    ),
  ]),
);

export const CircleSpells = new ConfiguredFeature<LandType>(
  "Circle Spells",
  `Your mystical connection to the land infuses you with the ability to cast certain spells. At 3rd, 5th, 7th, and 9th level you gain access to circle spells connected to the land where you became a druid. Choose that land—arctic, coast, desert, forest, grassland, mountain, swamp, or Underdark—and consult the associated list of spells.

Once you gain access to a circle spell, you always have it prepared, and it doesn't count against the number of spells you can prepare each day. If you gain access to a spell that doesn't appear on the druid spell list, the spell is nonetheless a druid spell for you.`,
  (g, me, type) => {
    const feature = bonusSpellsFeatures.get(type);
    feature?.setup(g, me);
  },
);

const DruidLandsStride = makeLandsStride(
  `Starting at 6th level, moving through nonmagical difficult terrain costs you no extra movement. You can also pass through nonmagical plants without being slowed by them and without taking damage from them if they have thorns, spines, or a similar hazard.

In addition, you have advantage on saving throws against plants that are magically created or manipulated to impede movement, such as those created by the entangle spell.`,
);

const wardTypes = ctSet("elemental", "fey");
const NaturesWard = new SimpleFeature(
  "Nature's Ward",
  `When you reach 10th level, you can't be charmed or frightened by elementals or fey, and you are immune to poison and disease.`,
  (g, me) => {
    g.events.on(
      "BeforeEffect",
      ({ detail: { config, effect, attacker, who, success } }) => {
        const isPoisonOrDisease =
          config.conditions?.has("Poisoned") ||
          hasAny(effect.tags, ["poison", "disease"]);
        const isCharmOrFrighten = hasAny(config.conditions, [
          "Charmed",
          "Frightened",
        ]);
        const isElementalOrFey = attacker && wardTypes.has(attacker.type);

        if (
          who === me &&
          ((isElementalOrFey && isCharmOrFrighten) || isPoisonOrDisease)
        )
          success.add("fail", NaturesWard);
      },
    );
  },
);

// TODO
const NaturesSanctuary = notImplementedFeature(
  "Nature's Sanctuary",
  `When you reach 14th level, creatures of the natural world sense your connection to nature and become hesitant to attack you. When a beast or plant creature attacks you, that creature must make a Wisdom saving throw against your druid spell save DC. On a failed save, the creature must choose a different target, or the attack automatically misses. On a successful save, the creature is immune to this effect for 24 hours.

The creature is aware of this effect before it makes its attack against you.`,
);

const Land: PCSubclass = {
  className: "Druid",
  name: "Circle of the Land",
  features: new Map([
    [2, [BonusCantrip, NaturalRecovery, CircleSpells]],
    [6, [DruidLandsStride]],
    [10, [NaturesWard]],
    [14, [NaturesSanctuary]],
  ]),
};
export default Land;
