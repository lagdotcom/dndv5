import Ability from "./Ability";
import Feature from "./Feature";
import { ArmorCategory, WeaponCategory } from "./Item";
import PCClassName from "./PCClassName";
import SkillName from "./SkillName";

export default interface PCClass {
  name: PCClassName;
  hitDieSize: number;
  armorProficiencies?: Set<ArmorCategory>;
  weaponCategoryProficiencies?: Set<WeaponCategory>;
  weaponProficiencies?: Set<string>;
  toolProficiencies?: Set<string>;
  saveProficiencies?: Set<Ability>;
  skillChoices: number;
  skillProficiencies: Set<SkillName>;
  features: Map<number, Feature[]>;
}
