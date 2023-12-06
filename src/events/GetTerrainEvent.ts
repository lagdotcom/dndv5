import DifficultTerrainCollector from "../collectors/DifficultTerrainCollector";
import Combatant from "../types/Combatant";
import Point from "../types/Point";

export interface GetTerrainDetail {
  where: Point;
  who: Combatant;
  difficult: DifficultTerrainCollector;
}

export default class GetTerrainEvent extends CustomEvent<GetTerrainDetail> {
  constructor(detail: GetTerrainDetail) {
    super("GetTerrain", { detail });
  }
}
