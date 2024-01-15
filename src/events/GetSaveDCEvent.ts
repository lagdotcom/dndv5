import BonusCollector from "../collectors/BonusCollector";
import InterruptionCollector from "../collectors/InterruptionCollector";
import { DifficultyClass } from "../flavours";
import AbilityName from "../types/AbilityName";
import Combatant from "../types/Combatant";
import SaveType from "../types/SaveType";
import Source from "../types/Source";
import Spell from "../types/Spell";
import SpellcastingMethod from "../types/SpellcastingMethod";

export interface GetSaveDCDetail {
  source: Source;
  who?: Combatant;
  target?: Combatant;
  type: SaveType;
  ability?: AbilityName;
  bonus: BonusCollector<DifficultyClass>;
  interrupt: InterruptionCollector;
  spell?: Spell;
  method?: SpellcastingMethod;
}

export default class GetSaveDCEvent extends CustomEvent<GetSaveDCDetail> {
  constructor(detail: GetSaveDCDetail) {
    super("GetSaveDC", { detail });
  }
}
