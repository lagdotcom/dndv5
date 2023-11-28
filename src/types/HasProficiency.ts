import AbilityName from "./AbilityName";
import Item, { ArmorCategory, WeaponCategory } from "./Item";
import SkillName from "./SkillName";
import ToolName from "./ToolName";
import WeaponType from "./WeaponType";

type HasProficiency =
  | Item
  | AbilityName
  | SkillName
  | ToolName
  | WeaponCategory
  | WeaponType
  | ArmorCategory;
export default HasProficiency;
