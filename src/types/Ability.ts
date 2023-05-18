export const Abilities = ["str", "dex", "con", "int", "wis", "cha"] as const;
type Ability = (typeof Abilities)[number];
export default Ability;
