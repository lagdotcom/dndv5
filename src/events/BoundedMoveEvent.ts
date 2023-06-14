import Combatant from "../types/Combatant";
import MoveHandler from "../types/MoveHandler";

export interface BoundedMoveDetail {
  who: Combatant;
  handler: MoveHandler;
  resolve(): void;
}

export default class BoundedMoveEvent extends CustomEvent<BoundedMoveDetail> {
  constructor(detail: BoundedMoveDetail) {
    super("BoundedMove", { detail });
  }
}
