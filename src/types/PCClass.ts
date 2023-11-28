import AbilityName from "./AbilityName";
import Feature from "./Feature";
import { ArmorCategory, WeaponCategory } from "./Item";
import PCClassName from "./PCClassName";
import SkillName from "./SkillName";
import ToolName from "./ToolName";
import WeaponType from "./WeaponType";

export default interface PCClass {
  name: PCClassName;
  hitDieSize: number;
  armorProficiencies?: Set<ArmorCategory>;
  weaponCategoryProficiencies?: Set<WeaponCategory>;
  weaponProficiencies?: Set<WeaponType>;
  toolProficiencies?: Set<ToolName>;
  saveProficiencies?: Set<AbilityName>;
  skillChoices: number;
  skillProficiencies: Set<SkillName>;
  multi: {
    abilities: Map<AbilityName, number>;
    armorProficiencies?: Set<ArmorCategory>;
    weaponCategoryProficiencies?: Set<WeaponCategory>;
    weaponProficiencies?: Set<string>;
    toolProficiencies?: Set<ToolName>;
    saveProficiencies?: Set<AbilityName>;
    skillChoices?: number;
    skillProficiencies?: Set<SkillName>;
  };
  features: Map<number, Feature[]>;
}
