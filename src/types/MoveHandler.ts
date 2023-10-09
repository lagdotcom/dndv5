import Combatant from "./Combatant";
import Source from "./Source";

export default interface MoveHandler extends Source {
  maximum: number;
  cannotApproach: Set<Combatant>;
  mustUseAll: boolean;
  provokesOpportunityAttacks: boolean;
  teleportation: boolean;

  onMove(who: Combatant, cost: number): boolean;
}
