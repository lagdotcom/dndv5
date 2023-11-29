import Artificer from "../classes/artificer";
import Barbarian from "../classes/barbarian";
import Bard from "../classes/bard";
import Cleric from "../classes/cleric";
import Druid from "../classes/druid";
import Fighter from "../classes/fighter";
import Monk from "../classes/monk";
import Paladin from "../classes/paladin";
import Ranger from "../classes/ranger";
import Rogue from "../classes/rogue";
import Sorcerer from "../classes/sorcerer";
import Warlock from "../classes/warlock";
import Wizard from "../classes/wizard";
import PCClass from "../types/PCClass";
import PCClassName from "../types/PCClassName";

const allPCClasses: Record<PCClassName, PCClass> = {
  Artificer,
  Barbarian,
  Bard,
  Cleric,
  Druid,
  Fighter,
  Monk,
  Paladin,
  Ranger,
  Rogue,
  Sorcerer,
  Warlock,
  Wizard,
};
export default allPCClasses;
