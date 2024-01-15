import { HitPoints, Score, Url } from "../flavours";
import AbilityName from "../types/AbilityName";
import { AlignmentPair } from "../types/Alignment";
import HasProficiency from "../types/HasProficiency";
import LanguageName from "../types/LanguageName";
import PCClassName from "../types/PCClassName";
import { BackgroundName } from "./allBackgrounds";
import { FeatureName } from "./allFeatures";
import { PCRaceName } from "./allPCRaces";
import { PCSubclassName } from "./allPCSubclasses";
import { SpellName } from "./allSpells";
import InventoryItem from "./InventoryItem";

type FeatureConfigs = Record<string, unknown>;

export default interface PCTemplate {
  name: string;
  tokenUrl: Url;
  abilities: [
    str: Score,
    dex: Score,
    con: Score,
    int: Score,
    wis: Score,
    cha: Score,
  ];
  race: {
    name: PCRaceName;
    abilities?: AbilityName[];
    configs?: FeatureConfigs;
    languages?: LanguageName[];
  };
  alignment: AlignmentPair;
  background: {
    name: BackgroundName;
    languages?: LanguageName[];
    proficiencies?: HasProficiency[];
  };
  levels: {
    class: PCClassName;
    subclass?: PCSubclassName;
    configs?: FeatureConfigs;
    hpRoll?: HitPoints;
    proficiencies?: HasProficiency[];
  }[];
  proficiencies?: HasProficiency[];
  feats?: FeatureName[];
  configs?: FeatureConfigs;
  languages?: LanguageName[];
  items: InventoryItem[];
  known?: SpellName[];
  prepared?: SpellName[];
}
