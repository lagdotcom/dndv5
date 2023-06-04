import DndRule from "./DndRule";
import Engine from "./Engine";
import CombatantEffect from "./types/CombatantEffect";

export default class Effect implements CombatantEffect {
  rule?: DndRule;

  constructor(
    public name: string,
    public durationTimer: CombatantEffect["durationTimer"],
    setup?: (g: Engine) => void,
    public quiet = false
  ) {
    if (setup) this.rule = new DndRule(name, setup);
  }
}
