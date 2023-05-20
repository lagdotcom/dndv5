export const DiceTypes = ["advantage", "disadvantage", "normal"] as const;
export type DiceType = (typeof DiceTypes)[number];
