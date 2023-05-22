import Spell from "./Spell";

export default interface Concentration {
  spell: Spell;
  duration: number;
  onSpellEnd(): Promise<void>;
}
