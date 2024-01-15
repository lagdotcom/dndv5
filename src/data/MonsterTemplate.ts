import Engine from "../Engine";
import {
  ArmorClass,
  ChallengeRating,
  Feet,
  HitPoints,
  Modifier,
  PCClassLevel,
  Score,
  Url,
} from "../flavours";
import Monster from "../Monster";
import { NaturalWeaponOnHit } from "../monsters/NaturalWeapon";
import AbilityName from "../types/AbilityName";
import { ActionConfig } from "../types/Action";
import AICoefficient from "../types/AICoefficient";
import AIRule from "../types/AIRule";
import { AlignmentPair } from "../types/Alignment";
import CombatantGroup from "../types/CombatantGroup";
import ConditionName from "../types/ConditionName";
import CreatureType from "../types/CreatureType";
import DamageAmount from "../types/DamageAmount";
import DamageResponse from "../types/DamageResponse";
import DamageType from "../types/DamageType";
import Empty from "../types/Empty";
import Feature from "../types/Feature";
import { StringProficiency } from "../types/HasProficiency";
import LanguageName from "../types/LanguageName";
import MovementType from "../types/MovementType";
import PCClassName from "../types/PCClassName";
import ProficiencyType from "../types/ProficiencyType";
import SenseName from "../types/SenseName";
import SizeCategory from "../types/SizeCategory";
import { SpellName } from "./allSpells";
import InventoryItem from "./InventoryItem";

export interface NaturalWeaponInfo {
  name: string;
  toHit: Modifier | AbilityName;
  damage: DamageAmount;
  onHit?: NaturalWeaponOnHit;
}

export default interface MonsterTemplate<T = Empty> {
  base?: Partial<MonsterTemplate<T>>;
  name: string;
  tokenUrl: Url;
  cr?: ChallengeRating;
  type?: CreatureType;
  size?: SizeCategory;
  reach?: Feet;
  hpMax: HitPoints;
  makesDeathSaves?: boolean;
  pb?: Modifier;
  abilities?: [
    str: Score,
    dex: Score,
    con: Score,
    int: Score,
    wis: Score,
    cha: Score,
  ];
  align?: AlignmentPair;
  naturalAC?: ArmorClass;
  movement?: Partial<Record<MovementType, Feet>>;
  levels?: Partial<Record<PCClassName, PCClassLevel>>;
  proficiency?: Partial<Record<StringProficiency, ProficiencyType>>;
  damage?: Partial<Record<DamageType, DamageResponse>>;
  immunities?: ConditionName[];
  languages?: LanguageName[];
  items?: InventoryItem[];
  senses?: Partial<Record<SenseName, Feet>>;
  spells?: SpellName[];
  naturalWeapons?: NaturalWeaponInfo[];
  features?: Feature[];
  aiRules?: AIRule[];
  aiCoefficients?: Map<AICoefficient, number>;
  aiGroups?: CombatantGroup[];
  setup?: (this: Monster) => void;

  config?: {
    initial: T;
    get: (g: Engine, config: Partial<T>) => ActionConfig<T>;
    apply: (this: Monster, config: T) => void;
  };
}
