export const SkillNames = ["intimidation"] as const;
type SkillName = (typeof SkillNames)[number];
export default SkillName;
