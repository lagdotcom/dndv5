import Engine from "../Engine";
import CombatantPlacedEvent from "../events/CombatantPlacedEvent";
import Combatant from "../types/Combatant";
import { make } from "../utils/dom";
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
    this.units = new Set();
    this.element = g.container.appendChild(
      make("div", { className: styles.main }, { click: onClickBattlefield })
    );

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
