import Berserker from "../classes/barbarian/Berserker";
import Land from "../classes/druid/Land";
import Devotion from "../classes/paladin/Devotion";
import Scout from "../classes/rogue/Scout";
import Evocation from "../classes/wizard/Evocation";

const allPCSubclasses = {
  // Barbarian
  Berserker,

  // Druid
  Land,

  // Paladin
  Devotion,

  // Rogue
  Scout,

  // Wizard
  Evocation,
} as const;
export default allPCSubclasses;

export type PCSubclassName = keyof typeof allPCSubclasses;
