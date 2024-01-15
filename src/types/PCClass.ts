import { DiceSize, PCClassLevel, Score } from "../flavours";
import AbilityName from "./AbilityName";
import Feature from "./Feature";
import Gain from "./Gain";
import { ArmorCategory, WeaponCategory } from "./Item";
import PCClassName from "./PCClassName";
import SkillName from "./SkillName";
import ToolName from "./ToolName";
import WeaponType from "./WeaponType";

export interface ProficiencyGains {
  armor?: Set<ArmorCategory>;
  weaponCategory?: Set<WeaponCategory>;
  weapon?: Set<WeaponType>;
  save?: Set<AbilityName>;

  skill?: Gain<SkillName>[];
  tool?: Gain<ToolName>[];
}

export default interface PCClass extends ProficiencyGains {
  name: PCClassName;
  hitDieSize: DiceSize;
  multi: { requirements: Map<AbilityName, Score> } & ProficiencyGains;
  features: Map<PCClassLevel, Feature[]>;
}
