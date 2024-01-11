import Engine from "../Engine";
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
  toHit: number | AbilityName;
  damage: DamageAmount;
  onHit?: NaturalWeaponOnHit;
}

export default interface MonsterTemplate<T = Empty> {
  base?: Partial<MonsterTemplate<T>>;
  name: string;
  tokenUrl: string;
  cr?: number;
  type?: CreatureType;
  size?: SizeCategory;
  reach?: number;
  hpMax: number;
  makesDeathSaves?: boolean;
  pb?: number;
  abilities?: [
    str: number,
    dex: number,
    con: number,
    int: number,
    wis: number,
    cha: number,
  ];
  align?: AlignmentPair;
  naturalAC?: number;
  movement?: Partial<Record<MovementType, number>>;
  levels?: Partial<Record<PCClassName, number>>;
  proficiency?: Partial<Record<StringProficiency, ProficiencyType>>;
  damage?: Partial<Record<DamageType, DamageResponse>>;
  immunities?: ConditionName[];
  languages?: LanguageName[];
  items?: InventoryItem[];
  senses?: Partial<Record<SenseName, number>>;
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
