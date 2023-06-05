import DamageResponseCollector from "../collectors/DamageResponseCollector";
import Combatant from "../types/Combatant";
import DamageType from "../types/DamageType";

export interface GetDamageResponseDetail {
  who: Combatant;
  damageType: DamageType;
  response: DamageResponseCollector;
}

export default class GetDamageResponseEvent extends CustomEvent<GetDamageResponseDetail> {
  constructor(detail: GetDamageResponseDetail) {
    super("GetDamageResponse", { detail });
  }
}
