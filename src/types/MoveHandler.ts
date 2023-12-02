import BeforeMoveEvent from "../events/BeforeMoveEvent";
import Combatant from "./Combatant";
import Source from "./Source";

export default interface MoveHandler extends Source {
  maximum: number;
  mustUseAll: boolean;
  provokesOpportunityAttacks: boolean;
  teleportation: boolean;

  check?: (e: BeforeMoveEvent) => void;
  onMove: (who: Combatant, cost: number) => boolean;
}
