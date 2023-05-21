export const DiceTypes = ["advantage", "disadvantage", "normal"] as const;
type DiceType = (typeof DiceTypes)[number];
export default DiceType;
