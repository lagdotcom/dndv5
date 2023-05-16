import Engine from "../Engine";
import CombatantDiedEvent from "../events/CombatantDiedEvent";
import CombatantMovedEvent from "../events/CombatantMovedEvent";
import TurnStartedEvent from "../events/TurnStartedEvent";
import { busy, moveButtonSize, scale } from "../globals";
import Combatant from "../types/Combatant";
import { configure, make, px } from "../utils/dom";
import styles from "./Unit.module.scss";

const buttonTypes = {
  north: {
    className: styles.moveN,
    emoji: "⬆️",
    label: "North",
    dx: 0,
    dy: -1,
  },
  east: { className: styles.moveE, emoji: "➡️", label: "East", dx: 1, dy: 0 },
  south: { className: styles.moveS, emoji: "⬇️", label: "South", dx: 0, dy: 1 },
  west: { className: styles.moveW, emoji: "⬅️", label: "West", dx: -1, dy: 0 },
};
type ButtonType = keyof typeof buttonTypes;

class UnitMoveButton {
  element: HTMLButtonElement;

  constructor(
    public parent: HTMLDivElement,
    public type: ButtonType,
    private onMove: (type: ButtonType) => void
  ) {
    const { className, label } = buttonTypes[type];

    this.element = parent.appendChild(
      configure(
        make("button"),
        {
          className: `${styles.moveButton} ${className}`,
          textContent: label,
        },
        { click: this.onClick }
      )
    );
  }

  onClick = (e: MouseEvent) => {
    e.stopPropagation();
    this.onMove(this.type);
  };

  show(value: boolean) {
    this.element.style.display = value ? "" : "none";
  }

  resize(size: number) {
    const offset = (size - moveButtonSize.value) / 2;
    if (this.type === "north" || this.type === "south")
      this.element.style.left = px(offset);
    else this.element.style.top = px(offset);
  }
}

export default class Unit {
  element: HTMLDivElement;
  moveButtons: UnitMoveButton[];
  size!: number;
  token: HTMLImageElement;

  constructor(
    public g: Engine,
    public who: Combatant,
    public x: number,
    public y: number,
    private onRemove: (u: Unit) => void
  ) {
    this.element = configure(make("div"), { className: styles.main });
    this.token = this.element.appendChild(
      configure(make("img"), {
        className: styles.token,
        alt: who.name,
        src: who.img,
      })
    );
    this.moveButtons = [
      new UnitMoveButton(this.element, "north", this.onMove),
      new UnitMoveButton(this.element, "east", this.onMove),
      new UnitMoveButton(this.element, "south", this.onMove),
      new UnitMoveButton(this.element, "west", this.onMove),
    ];

    busy.on(this.onBusyChange);
    scale.on(this.update);
    this.update();
    this.isMyTurn(false);

    g.ui.battlefield.element.appendChild(this.element);
    g.events.on("combatantDied", this.onCombatantDied);
    g.events.on("combatantMoved", this.onCombatantMoved);
    g.events.on("turnStarted", this.onTurnStarted);
  }

  update() {
    const offset = scale.value / 5;
    this.element.style.left = px(this.x * offset);
    this.element.style.top = px(this.y * offset);

    this.size = this.who.sizeInUnits * scale.value;
    this.element.style.width = px(this.size);
    this.element.style.height = px(this.size);
    this.token.style.width = px(this.size);
    this.token.style.height = px(this.size);

    for (const btn of this.moveButtons) btn.resize(this.size);
  }

  isMyTurn(value: boolean) {
    for (const btn of this.moveButtons) btn.show(value);
  }

  onBusyChange = (value: boolean) => {
    for (const btn of this.moveButtons) btn.element.disabled = value;
  };

  onCombatantDied = ({ detail: { who } }: CombatantDiedEvent) => {
    if (who === this.who) {
      this.element.remove();
      this.onRemove(this);
    }
  };

  onCombatantMoved = ({ detail: { who, x, y } }: CombatantMovedEvent) => {
    if (who === this.who) {
      this.x = x;
      this.y = y;
      this.update();
    }
  };

  onMove = async (type: ButtonType) => {
    const { dx, dy } = buttonTypes[type];

    busy.set(true);
    await this.g.move(this.who, dx * 5, dy * 5);
    busy.set(false);
  };

  onTurnStarted = ({ detail: { who } }: TurnStartedEvent) => {
    this.isMyTurn(who === this.who);
  };
}
