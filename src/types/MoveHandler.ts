import Combatant from "./Combatant";
import Source from "./Source";

export default interface MoveHandler extends Source {
  maximum: number;
  provokesOpportunityAttacks: boolean;
  onMove(who: Combatant, cost: number): boolean;
}
