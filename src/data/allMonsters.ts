import Birnotec from "../monsters/fiendishParty/Birnotec";
import Kay from "../monsters/fiendishParty/Kay";
import OGonrit from "../monsters/fiendishParty/OGonrit";
import Yulash from "../monsters/fiendishParty/Yulash";
import Zafron from "../monsters/fiendishParty/Zafron";
import { Badger, Bat, GiantBadger } from "../monsters/srd/beast";
import { Goblin } from "../monsters/srd/goblinoid";
import { Thug } from "../monsters/srd/humanoid";
import { CombatantCreator } from "./BattleTemplate";

const allMonsters = {
  badger: (g) => new Badger(g),
  bat: (g) => new Bat(g),
  "giant badger": (g) => new GiantBadger(g),
  goblin: (g) => new Goblin(g),
  "goblin [bow]": (g) => new Goblin(g, true),
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
