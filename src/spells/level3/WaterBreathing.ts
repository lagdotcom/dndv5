import { HasTargets } from "../../configs";
import { canSee } from "../../filters";
import { simpleSpell } from "../common";
import { targetsMany } from "../helpers";

const WaterBreathing = simpleSpell<HasTargets>({
  name: "Water Breathing",
  level: 3,
  ritual: true,
  school: "Transmutation",
  v: true,
  s: true,
  m: "a short reed or piece of straw",
  lists: ["Artificer", "Druid", "Ranger", "Sorcerer", "Wizard"],
  description: `This spell grants up to ten willing creatures you can see within range the ability to breathe underwater until the spell ends. Affected creatures also retain their normal mode of respiration.`,

  ...targetsMany(1, 10, 30, [canSee]),

  async apply() {
    // TODO [TERRAIN]
  },
});
export default WaterBreathing;
