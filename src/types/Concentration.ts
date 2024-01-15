import { Turns } from "../flavours";
import Spell from "./Spell";

export default interface Concentration {
  spell: Spell;
  duration: Turns;
  onSpellEnd(): Promise<unknown>;
}
