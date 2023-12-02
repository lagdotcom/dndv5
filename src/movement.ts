import BeforeMoveEvent from "./events/BeforeMoveEvent";
import Combatant from "./types/Combatant";
import MoveHandler from "./types/MoveHandler";
import Source from "./types/Source";

export const getDefaultMovement = (who: Combatant): MoveHandler => ({
  name: "Movement",
  maximum: who.speed,
  mustUseAll: false,
  provokesOpportunityAttacks: true,
  teleportation: false,
  onMove(who, cost) {
    who.movedSoFar += cost;
    return who.movedSoFar >= who.speed;
  },
});

export const getTeleportation = (
  maximum: number,
  name = "Teleport",
): MoveHandler => ({
  name,
  maximum,
  mustUseAll: false,
  provokesOpportunityAttacks: false,
  teleportation: true,
  onMove: () => true,
});

type BoundedMoveConfig = Omit<MoveHandler, "maximum" | "onMove" | "name">;

export class BoundedMove implements MoveHandler {
  name: string;
  used: number;
  mustUseAll: boolean;
  provokesOpportunityAttacks: boolean;
  teleportation: boolean;
  check?: (e: BeforeMoveEvent) => void;

  constructor(
    public source: Source,
    public maximum: number,
    {
      check,
      mustUseAll = false,
      provokesOpportunityAttacks = true,
      teleportation = false,
    }: Partial<BoundedMoveConfig> = {},
  ) {
    this.name = source.name;
    this.used = 0;
    this.check = check;
    this.mustUseAll = mustUseAll;
    this.provokesOpportunityAttacks = provokesOpportunityAttacks;
    this.teleportation = teleportation;
  }

  onMove(who: Combatant, cost: number) {
    this.used += cost;
    return this.used >= this.maximum;
  }
}
