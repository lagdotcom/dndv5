import AbilityName from "./AbilityName";
import Item, { ArmorCategory, WeaponCategory } from "./Item";
import SkillName from "./SkillName";
import ToolName from "./ToolName";

type HasProficiency =
  | Item
  | AbilityName
  | SkillName
  | ToolName
  | WeaponCategory
  | ArmorCategory;
export default HasProficiency;
