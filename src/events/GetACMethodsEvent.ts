import ACMethod from "../types/ACMethod";
import Combatant from "../types/Combatant";

export interface GetACMethodsDetail {
  who: Combatant;
  methods: ACMethod[]; // TODO collector?
}

export default class GetACMethodsEvent extends CustomEvent<GetACMethodsDetail> {
  constructor(detail: GetACMethodsDetail) {
    super("GetACMethods", { detail });
  }
}
