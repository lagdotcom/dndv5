import DndRule from "./DndRule";
import Combatant from "./types/Combatant";
import MoveHandler from "./types/MoveHandler";
import Source from "./types/Source";
import { getDistanceBetween } from "./utils/units";

export const getDefaultMovement = (who: Combatant): MoveHandler => ({
  name: "Movement",
  cannotApproach: new Set(),
  maximum: who.speed,
  mustUseAll: false,
  provokesOpportunityAttacks: true,
  onMove(who, cost) {
    who.movedSoFar += cost;
    return who.movedSoFar >= who.speed;
  },
});

export const BoundedMoveRule = new DndRule("Bounded Movement", (g) => {
  g.events.on("BeforeMove", ({ detail: { who, from, to, handler, error } }) => {
    for (const other of handler.cannotApproach) {
      const otherPos = g.getState(other).position;

      const oldDistance = getDistanceBetween(
        from,
        who.sizeInUnits,
        otherPos,
        other.sizeInUnits
      );
      const newDistance = getDistanceBetween(
        to,
        who.sizeInUnits,
        otherPos,
        other.sizeInUnits
      );

      if (newDistance < oldDistance)
        error.add(`cannot move towards ${other.name}`, BoundedMoveRule);
    }
  });
});

interface BoundedMoveConfig {
  cannotApproach: Combatant[];
  mustUseAll: boolean;
  provokesOpportunityAttacks: boolean;
}

export class BoundedMove implements MoveHandler {
  name: string;
  used: number;
  cannotApproach: Set<Combatant>;
  mustUseAll: boolean;
  provokesOpportunityAttacks: boolean;

  constructor(
    public source: Source,
    public maximum: number,
    {
      cannotApproach = [],
      mustUseAll = false,
      provokesOpportunityAttacks = true,
    }: Partial<BoundedMoveConfig> = {}
  ) {
    this.name = source.name;
    this.used = 0;
    this.cannotApproach = new Set(cannotApproach);
    this.mustUseAll = mustUseAll;
    this.provokesOpportunityAttacks = provokesOpportunityAttacks;
  }

  onMove(who: Combatant, cost: number) {
    this.used += cost;
    return this.used >= this.maximum;
  }
}
