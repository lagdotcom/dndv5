import "./ui.css";

import Engine from "../Engine";
import TurnStartedEvent from "../events/TurnStartedEvent";
import { busy } from "../globals";
import Action from "../types/Action";
import Combatant from "../types/Combatant";
import { checkConfig } from "../utils/config";
import Battlefield from "./Battlefield";
import Menu from "./Menu";

export default class UI {
  actionMenu: Menu<Action>;
  battlefield: Battlefield;
  current?: Combatant;
  target?: Combatant;

  constructor(public g: Engine) {
    this.actionMenu = new Menu(g, this.onClickAction);
    this.battlefield = new Battlefield(
      g,
      this.onClickBattlefield,
      this.onClickCombatant
    );

    g.events.on("turnStarted", this.onTurnStarted);
  }

  onClickAction = async <T extends object>(action: Action<T>) => {
    this.actionMenu.hide();

    const config = { target: this.target };
    if (checkConfig(action, config)) {
      busy.set(true);
      await action.apply(this.g, config);
      busy.set(false);
    } else console.warn(config, "does not match", action.config);
  };

  onClickBattlefield = async () => {
    this.target = undefined;
    this.actionMenu.hide();
  };

  onClickCombatant = async (who: Combatant, e: MouseEvent) => {
    e.stopPropagation();

    if (this.current) {
      this.target = who;
      busy.set(true);
      const actions = await this.g.getActions(this.current, who);
      busy.set(false);

      this.actionMenu.clear();
      for (const action of actions) this.actionMenu.add(action.name, action);
      this.actionMenu.show(e.clientX, e.clientY);
    }
  };

  onTurnStarted = ({ detail: { who } }: TurnStartedEvent) => {
    this.current = who;
    this.target = undefined;
  };
}
