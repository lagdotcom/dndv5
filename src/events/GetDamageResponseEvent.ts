import DamageResponseCollector from "../collectors/DamageResponseCollector";
import Combatant from "../types/Combatant";
import DamageType from "../types/DamageType";
import Source from "../types/Source";
import { AttackDetail } from "./AttackEvent";

export interface GetDamageResponseDetail {
  source: Source;
  who: Combatant;
  attack?: AttackDetail;
  damageType: DamageType;
  response: DamageResponseCollector;
}

export default class GetDamageResponseEvent extends CustomEvent<GetDamageResponseDetail> {
  constructor(detail: GetDamageResponseDetail) {
    super("GetDamageResponse", { detail });
  }
}
