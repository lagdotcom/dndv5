import BonusCollector from "../collectors/BonusCollector";
import DiceTypeCollector from "../collectors/DiceTypeCollector";
import InterruptionCollector from "../collectors/InterruptionCollector";
import ProficiencyCollector from "../collectors/ProficiencyCollector";
import SaveDamageResponseCollector from "../collectors/SaveDamageResponseCollector";
import SuccessResponseCollector from "../collectors/SuccessResponseCollector";
import Effect from "../Effect";
import AbilityName from "../types/AbilityName";
import Combatant from "../types/Combatant";
import { EffectConfig } from "../types/EffectType";
import Empty from "../types/Empty";
import SaveTag from "../types/SaveTag";
import Spell from "../types/Spell";
import SpellcastingMethod from "../types/SpellcastingMethod";

export interface BeforeSaveDetail<T = unknown> {
  attacker?: Combatant;
  who: Combatant;
  dc: number;
  ability?: AbilityName;
  diceType: DiceTypeCollector;
  proficiency: ProficiencyCollector;
  pb: BonusCollector;
  bonus: BonusCollector;
  successResponse: SuccessResponseCollector;
  saveDamageResponse: SaveDamageResponseCollector;
  failDamageResponse: SaveDamageResponseCollector;
  spell?: Spell;
  method?: SpellcastingMethod;
  effect?: Effect<T>;
  config?: EffectConfig<T>;
  tags: Set<SaveTag>;
  interrupt: InterruptionCollector;
}

export default class BeforeSaveEvent<T = Empty> extends CustomEvent<
  BeforeSaveDetail<T>
> {
  constructor(detail: BeforeSaveDetail<T>) {
    super("BeforeSave", { detail });
  }
}
