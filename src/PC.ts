import AbstractCombatant from "./AbstractCombatant";
import Engine from "./Engine";

export default class PC extends AbstractCombatant {
  constructor(g: Engine, name: string, raceName: string, img: string) {
    super(g, name, "humanoid", "medium", img, 0, false);
  }
}
