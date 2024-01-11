import Birnotec from "../monsters/fiendishParty/Birnotec";
import Kay from "../monsters/fiendishParty/Kay";
import OGonrit from "../monsters/fiendishParty/OGonrit";
import Yulash from "../monsters/fiendishParty/Yulash";
import Zafron from "../monsters/fiendishParty/Zafron";
import { Chuul } from "../monsters/srd/aberration";
import { Badger, Bat, GiantBadger } from "../monsters/srd/beast";
import {
  AirElemental,
  EarthElemental,
  FireElemental,
  WaterElemental,
} from "../monsters/srd/elemental";
import { Goblin } from "../monsters/srd/goblinoid";
import {
  Acolyte,
  Archmage,
  Assassin,
  Bandit,
  BanditCaptain,
  Berserker,
  Commoner,
  CultFanatic,
  Cultist,
  Druid,
  Gladiator,
  Guard,
  Knight,
  Mage,
  Noble,
  Priest,
  Scout,
  Spy,
  Thug,
  TribalWarrior,
  Veteran,
} from "../monsters/srd/humanoid";

const allMonsters = {
  chuul: Chuul,

  badger: Badger,
  bat: Bat,
  "giant badger": GiantBadger,

  "air elemental": AirElemental,
  "earth elemental": EarthElemental,
  "fire elemental": FireElemental,
  "water elemental": WaterElemental,

  goblin: Goblin,

  acolyte: Acolyte,
  archmage: Archmage,
  assassin: Assassin,
  bandit: Bandit,
  "bandit captain": BanditCaptain,
  berserker: Berserker,
  commoner: Commoner,
  cultist: Cultist,
  "cult fanatic": CultFanatic,
  druid: Druid,
  gladiator: Gladiator,
  guard: Guard,
  knight: Knight,
  mage: Mage,
  noble: Noble,
  priest: Priest,
  scout: Scout,
  spy: Spy,
  thug: Thug,
  "tribal warrior": TribalWarrior,
  veteran: Veteran,

  Birnotec,
  "Kay of the Abyss": Kay,
  "O Gonrit": OGonrit,
  Yulash,
  "Zafron Halehart": Zafron,
} as const;
export default allMonsters;

export type MonsterName = keyof typeof allMonsters;
