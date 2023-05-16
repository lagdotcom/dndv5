import Engine from "../Engine";
import CombatantPlacedEvent from "../events/CombatantPlacedEvent";
import Combatant from "../types/Combatant";
import { configure, make } from "../utils/dom";
import styles from "./Battlefield.module.scss";
import Unit from "./Unit";

export default class Battlefield {
  element: HTMLDivElement;
  units: Set<Unit>;

  constructor(
    public g: Engine,
    onClickBattlefield: (e: MouseEvent) => void,
    private onClickCombatant: (who: Combatant, e: MouseEvent) => void
  ) {
    this.element = configure(
      make("div"),
      { className: styles.main },
      { click: onClickBattlefield }
    );
    this.units = new Set();

    g.container.appendChild(this.element);
    g.events.on("combatantPlaced", this.onCombatantPlaced);
  }

  removeUnit = (unit: Unit) => {
    this.units.delete(unit);
  };

  onCombatantPlaced = ({ detail: { who, x, y } }: CombatantPlacedEvent) => {
    const unit = new Unit(this.g, who, x, y, this.removeUnit);
    this.units.add(unit);

    unit.element.addEventListener("click", (e) =>
      this.onClickCombatant(who, e)
    );
  };
}
