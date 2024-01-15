import BeforeMoveEvent from "./events/BeforeMoveEvent";
import { Feet } from "./flavours";
import Combatant from "./types/Combatant";
import MoveHandler from "./types/MoveHandler";
import Source from "./types/Source";

export const getDefaultMovement = (who: Combatant): MoveHandler => ({
  name: "Movement",
  maximum: who.speed,
  forced: false,
  mustUseAll: false,
  provokesOpportunityAttacks: true,
  teleportation: false,
  turnMovement: true,
  onMove(who, cost) {
    who.movedSoFar += cost;
    return who.movedSoFar >= who.speed;
  },
});

export const getTeleportation = (
  maximum: Feet,
  name = "Teleport",
  turnMovement = false,
): MoveHandler => ({
  name,
  maximum,
  forced: false,
  mustUseAll: false,
  provokesOpportunityAttacks: false,
  teleportation: true,
  turnMovement,
  onMove: () => true,
});

type BoundedMoveConfig = Omit<MoveHandler, "maximum" | "onMove" | "name">;

export class BoundedMove implements MoveHandler {
  name: string;
  used: Feet;
  forced: boolean;
  mustUseAll: boolean;
  provokesOpportunityAttacks: boolean;
  teleportation: boolean;
  turnMovement: boolean;
  check?: (e: BeforeMoveEvent) => void;

  constructor(
    public source: Source,
    public maximum: Feet,
    {
      check,
      forced = false,
      mustUseAll = false,
      teleportation = false,
      turnMovement = false,
      provokesOpportunityAttacks = !(forced || teleportation),
    }: Partial<BoundedMoveConfig> = {},
  ) {
    this.name = source.name;
    this.used = 0;
    this.check = check;
    this.forced = forced;
    this.mustUseAll = mustUseAll;
    this.provokesOpportunityAttacks = provokesOpportunityAttacks;
    this.teleportation = teleportation;
    this.turnMovement = turnMovement;
  }

  onMove(who: Combatant, cost: Feet) {
    this.used += cost;
    return this.used >= this.maximum;
  }
}
