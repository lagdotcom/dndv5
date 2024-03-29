import { Description } from "../flavours";
import Gain from "./Gain";
import LanguageName from "./LanguageName";
import SkillName from "./SkillName";
import ToolName from "./ToolName";

export default interface PCBackground {
  name: string;
  description: Description;
  feature: { name: string; description: Description };
  skills: Gain<SkillName>[];
  tools?: Gain<ToolName>[];
  languages?: Gain<LanguageName>[];
}
