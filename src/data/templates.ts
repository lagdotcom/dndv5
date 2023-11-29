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
    addMonster("goblin [bow]", 15, 0),
    addMonster("goblin [bow]", 25, 0),
    addMonster("goblin", 20, 5),
    addMonster("goblin", 25, 5),
  ],
};

export const daviesVsFiends: BattleTemplate = {
  combatants: [
    addPC("Aura", 20, 20),
    addPC("Beldalynn", 10, 30),
    addPC("Galilea", 5, 0),
    addPC("Salgar", 15, 30),
    addPC("Hagrond", 0, 5),
    addMonster("Birnotec", 15, 0),
    addMonster("Kay of the Abyss", 20, 0),
    addMonster("O Gonrit", 10, 15),
    addMonster("Yulash", 25, 10),
    addMonster("Zafron Halehart", 10, 5),
  ],
};

export const tethVsGoblin: BattleTemplate = {
  combatants: [addPC("Tethilssethanar", 5, 5), addMonster("goblin", 15, 5)],
};
