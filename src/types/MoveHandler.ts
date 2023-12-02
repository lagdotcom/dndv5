import BeforeMoveEvent from "../events/BeforeMoveEvent";
import Combatant from "./Combatant";
import Source from "./Source";

export default interface MoveHandler extends Source {
  forced: boolean;
  maximum: number;
  mustUseAll: boolean;
  provokesOpportunityAttacks: boolean;
  teleportation: boolean;
  turnMovement: boolean;

  check?: (e: BeforeMoveEvent) => void;
  onMove: (who: Combatant, cost: number) => boolean;
}
