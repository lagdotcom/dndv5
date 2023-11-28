import Gain from "./Gain";
import LanguageName from "./LanguageName";
import SkillName from "./SkillName";
import ToolName from "./ToolName";

export default interface PCBackground {
  name: string;
  description: string;
  feature: { name: string; description: string };
  skills: Gain<SkillName>[];
  tools?: Gain<ToolName>[];
  languages?: Gain<LanguageName>[];
}
