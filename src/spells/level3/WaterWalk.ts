import { HasTargets } from "../../configs";
import { canSee } from "../../filters";
import { simpleSpell } from "../common";
import { targetsMany } from "../helpers";

const WaterWalk = simpleSpell<HasTargets>({
  name: "Water Walk",
  level: 3,
  ritual: true,
  school: "Transmutation",
  v: true,
  s: true,
  m: "a piece of cork",
  lists: ["Artificer", "Cleric", "Druid", "Ranger", "Sorcerer"],
  description: `This spell grants the ability to move across any liquid surface—such as water, acid, mud, snow, quicksand, or lava—as if it were harmless solid ground (creatures crossing molten lava can still take damage from the heat). Up to ten willing creatures you can see within range gain this ability for the duration.

  If you target a creature submerged in a liquid, the spell carries the target to the surface of the liquid at a rate of 60 feet per round.`,

  ...targetsMany(1, 10, 30, [canSee]),

  async apply() {
    // TODO [TERRAIN]
  },
});
export default WaterWalk;
