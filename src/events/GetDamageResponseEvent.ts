import DamageResponseCollector from "../collectors/DamageResponseCollector";
import Combatant from "../types/Combatant";
import DamageType from "../types/DamageType";
import { AttackEventDetail } from "./AttackEvent";

export interface GetDamageResponseDetail {
  who: Combatant;
  attack?: AttackEventDetail;
  damageType: DamageType;
  response: DamageResponseCollector;
}

export default class GetDamageResponseEvent extends CustomEvent<GetDamageResponseDetail> {
  constructor(detail: GetDamageResponseDetail) {
    super("GetDamageResponse", { detail });
  }
}
