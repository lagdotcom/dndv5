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
  Thug,
} from "../monsters/srd/humanoid";
import { CombatantCreator } from "./BattleTemplate";

const allMonsters = {
  chuul: (g) => new Chuul(g),

  badger: (g) => new Badger(g),
  bat: (g) => new Bat(g),
  "giant badger": (g) => new GiantBadger(g),

  "air elemental": (g) => new AirElemental(g),
  "earth elemental": (g) => new EarthElemental(g),
  "fire elemental": (g) => new FireElemental(g),
  "water elemental": (g) => new WaterElemental(g),

  goblin: (g) => new Goblin(g),
  "goblin [bow]": (g) => new Goblin(g, true),

  acolyte: (g) => new Acolyte(g),
  archmage: (g) => new Archmage(g),
  assassin: (g) => new Assassin(g),
  "assassin [crossbow]": (g) => new Assassin(g, true),
  bandit: (g) => new Bandit(g),
  "bandit [crossbow]": (g) => new Bandit(g, true),
  "bandit captain": (g) => new BanditCaptain(g),
  thug: (g) => new Thug(g),
  "thug [crossbow]": (g) => new Thug(g, true),

  Birnotec: (g) => new Birnotec(g),
  "Kay of the Abyss": (g) => new Kay(g),
  "O Gonrit": (g) => new OGonrit(g),
  Yulash: (g) => new Yulash(g),
  "Zafron Halehart": (g) => new Zafron(g),
} as const satisfies Record<string, CombatantCreator>;
export default allMonsters;

export type MonsterName = keyof typeof allMonsters;
