import Combatant from "./types/Combatant";

export const allyOf = (me: Combatant) => (who: Combatant) =>
  who.side === me.side;
