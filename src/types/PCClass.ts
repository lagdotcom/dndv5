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
  hitDieSize: number;
  multi: { requirements: Map<AbilityName, number> } & ProficiencyGains;
  features: Map<number, Feature[]>;
}
