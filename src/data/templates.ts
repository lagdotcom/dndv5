import Engine from "../Engine";
import Birnotec from "../monsters/fiendishParty/Birnotec";
import Kay from "../monsters/fiendishParty/Kay";
import OGonrit from "../monsters/fiendishParty/OGonrit";
import Yulash from "../monsters/fiendishParty/Yulash";
import Zafron from "../monsters/fiendishParty/Zafron";
import Goblin from "../monsters/Goblin";
import Aura from "../pcs/davies/Aura";
import Beldalynn from "../pcs/davies/Beldalynn";
import Galilea from "../pcs/davies/Galilea";
import Hagrond from "../pcs/davies/Hagrond";
import Salgar from "../pcs/davies/Salgar";
import Marvoril from "../pcs/glean/Marvoril";
import Shaira from "../pcs/glean/Shaira";
import Combatant from "../types/Combatant";

export type CombatantCreator = (g: Engine) => Combatant;

export interface BattleTemplateEntry {
  combatant: CombatantCreator;
  side?: number;
  x: number;
  y: number;
}

type BattleTemplate = BattleTemplateEntry[];
export default BattleTemplate;

export function useTemplate(g: Engine, template: BattleTemplate) {
  for (const { combatant, side, x, y } of template) {
    const who = combatant(g);
    if (typeof side === "number") who.side = side;
    g.place(who, x, y);
  }
  return g.start();
}

const bte = (
  combatant: CombatantCreator,
  x: number,
  y: number,
): BattleTemplateEntry => ({
  combatant,
  x,
  y,
});

export const gleanVsGoblins: BattleTemplate = [
  bte((g) => new Marvoril(g), 15, 30),
  bte((g) => new Shaira(g), 10, 35),
  bte((g) => new Goblin(g, true), 15, 0),
  bte((g) => new Goblin(g, true), 25, 0),
  bte((g) => new Goblin(g), 20, 5),
  bte((g) => new Goblin(g), 25, 5),
];

export const daviesVsFiends: BattleTemplate = [
  bte((g) => new Aura(g), 20, 20),
  bte((g) => new Beldalynn(g), 10, 30),
  bte((g) => new Galilea(g), 5, 0),
  bte((g) => new Salgar(g), 15, 30),
  bte((g) => new Hagrond(g), 0, 5),
  bte((g) => new Birnotec(g), 15, 0),
  bte((g) => new Kay(g), 20, 0),
  bte((g) => new OGonrit(g), 10, 15),
  bte((g) => new Yulash(g), 25, 10),
  bte((g) => new Zafron(g), 10, 5),
];
