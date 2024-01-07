import { MonsterName } from "./allMonsters";
import { PCName } from "./allPCs";
import BattleTemplate, { BattleTemplateEntry } from "./BattleTemplate";

const addPC = (name: PCName, x: number, y: number): BattleTemplateEntry => ({
  type: "pc",
  name,
  x,
  y,
});

const addMonster = (
  name: MonsterName,
  x: number,
  y: number,
): BattleTemplateEntry => ({
  type: "monster",
  name,
  x,
  y,
});

export const gleanVsGoblins: BattleTemplate = {
  combatants: [
    addPC("Marvoril", 15, 30),
    addPC("Shaira", 10, 35),
    addPC("Es'les", 10, 5),
    addPC("Faerfarn", 10, 20),
    addPC("Litt", 5, 15),
    addMonster("goblin [bow]", 15, 0),
    addMonster("goblin [bow]", 25, 0),
    addMonster("goblin", 20, 5),
    addMonster("goblin", 25, 5),
  ],
  images: [],
};

export const daviesVsFiends: BattleTemplate = {
  combatants: [
    addPC("Aura", 30, 45),
    addPC("Beldalynn", 10, 45),
    addPC("Galilea", 25, 40),
    addPC("Salgar", 20, 45),
    addPC("Hagrond", 15, 40),
    addMonster("Birnotec", 25, 0),
    addMonster("Kay of the Abyss", 35, 0),
    addMonster("O Gonrit", 20, 15),
    addMonster("Yulash", 15, 0),
    addMonster("Zafron Halehart", 25, 15),
  ],
  images: [
    {
      src: "https://lagdotcom.github.io/dndavies-assets/fp/ahnbiral-temple-space.png",
      x: 0,
      y: 0,
      width: 10,
      height: 10,
    },
  ],
};

export const tethVsGoblin: BattleTemplate = {
  combatants: [addPC("Tethilssethanar", 5, 5), addMonster("goblin", 15, 5)],
  images: [],
};
