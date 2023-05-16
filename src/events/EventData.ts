import Action from "../types/Action";
import Combatant from "../types/Combatant";
import RollType from "../types/RollType";

type EventData = {
  combatantDamaged: { who: Combatant; attacker: Combatant; total: number };
  combatantDied: { who: Combatant; attacker: Combatant };
  combatantMoved: {
    who: Combatant;
    ox: number;
    oy: number;
    x: number;
    y: number;
  };
  combatantPlaced: { who: Combatant; x: number; y: number };
  diceRolled: { type: RollType; size: number; value: number };
  getActions: { who: Combatant; target: Combatant; actions: Action[] };
  turnStarted: { who: Combatant };
};
export default EventData;
