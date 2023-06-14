import Combatant from "./types/Combatant";
import MoveHandler from "./types/MoveHandler";
import Source from "./types/Source";

export const getDefaultMovement = (who: Combatant): MoveHandler => ({
  name: "Movement",
  maximum: who.speed,
  provokesOpportunityAttacks: true,
  onMove(who, cost) {
    who.movedSoFar += cost;
    return who.movedSoFar >= who.speed;
  },
});

export class BoundedMove implements MoveHandler {
  name: string;
  used: number;

  constructor(
    public source: Source,
    public maximum: number,
    public provokesOpportunityAttacks: boolean = true
  ) {
    this.name = source.name;
    this.used = 0;
  }

  onMove(who: Combatant, cost: number) {
    this.used += cost;
    return this.used >= this.maximum;
  }
}
