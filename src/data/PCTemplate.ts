import AbilityName from "../types/AbilityName";
import { AlignmentPair } from "../types/Alignment";
import HasProficiency from "../types/HasProficiency";
import LanguageName from "../types/LanguageName";
import PCClassName from "../types/PCClassName";
import { BackgroundName } from "./allBackgrounds";
import { EnchantmentName } from "./allEnchantments";
import { FeatureName } from "./allFeatures";
import { ItemName } from "./allItems";
import { PCRaceName } from "./allPCRaces";
import { PCSubclassName } from "./allPCSubclasses";
import { SpellName } from "./allSpells";

type FeatureConfigs = Record<string, unknown>;

export default interface PCTemplate {
  name: string;
  tokenUrl: string;
  abilities: [
    str: number,
    dex: number,
    con: number,
    int: number,
    wis: number,
    cha: number,
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
    hpRoll?: number;
    proficiencies?: HasProficiency[];
  }[];
  proficiencies?: HasProficiency[];
  feats?: FeatureName[];
  configs?: FeatureConfigs;
  languages?: LanguageName[];
  items: {
    name: ItemName;
    equip?: boolean;
    attune?: boolean;
    quantity?: number;
    enchantments?: EnchantmentName[];
  }[];
  known?: SpellName[];
  prepared?: SpellName[];
}
