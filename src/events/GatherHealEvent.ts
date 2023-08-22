import BonusCollector from "../collectors/BonusCollector";
import InterruptionCollector from "../collectors/InterruptionCollector";
import MultiplierCollector from "../collectors/MultiplierCollector";
import Action from "../types/Action";
import Combatant from "../types/Combatant";
import Spell from "../types/Spell";

export interface GatherHealDetail {
  actor: Combatant;
  target: Combatant;
  action?: Action;
  spell?: Spell;
  bonus: BonusCollector;
  interrupt: InterruptionCollector;
  multiplier: MultiplierCollector;
}

export default class GatherHealEvent extends CustomEvent<GatherHealDetail> {
  constructor(detail: GatherHealDetail) {
    super("GatherHeal", { detail });
  }
}
