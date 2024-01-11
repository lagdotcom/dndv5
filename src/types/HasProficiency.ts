import AbilityName from "./AbilityName";
import Item, { ArmorCategory, WeaponCategory } from "./Item";
import SkillName from "./SkillName";
import ToolName from "./ToolName";
import WeaponType from "./WeaponType";

export type StringProficiency =
  | AbilityName
  | SkillName
  | ToolName
  | WeaponCategory
  | WeaponType
  | ArmorCategory;

type HasProficiency = StringProficiency | Item;
export default HasProficiency;
