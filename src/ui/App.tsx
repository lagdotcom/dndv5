import { useCallback, useEffect, useState } from "preact/hooks";

import Engine from "../Engine";
import Action from "../types/Action";
import Combatant from "../types/Combatant";
import { checkConfig } from "../utils/config";
import ActiveUnitPanelContainer from "./ActiveUnitPanelContainer";
import styles from "./App.module.scss";
import Battlefield from "./Battlefield";
import EventLog from "./EventLog";
import Menu, { MenuItem } from "./Menu";
import {
  activeCombatant,
  allActions,
  allCombatants,
  CombatantAndState,
} from "./state";

interface Props {
  g: Engine;
  onMount?: (g: Engine) => void;
}

interface ActionMenuState {
  show: boolean;
  x: number;
  y: number;
  items: MenuItem<Action>[];
}

export default function App({ g, onMount }: Props) {
  const [target, setTarget] = useState<Combatant>();
  const [actionMenu, setActionMenu] = useState<ActionMenuState>({
    show: false,
    x: NaN,
    y: NaN,
    items: [],
  });
  const hideActionMenu = useCallback(
    () => setActionMenu({ show: false, x: NaN, y: NaN, items: [] }),
    []
  );

  const refreshUnits = useCallback(() => {
    const list: CombatantAndState[] = [];
    for (const [who, state] of g.combatants) list.push({ who, state });
    allCombatants.value = list;
  }, [g]);

  useEffect(() => {
    g.events.on("combatantPlaced", refreshUnits);
    g.events.on("combatantMoved", refreshUnits);
    g.events.on("combatantDied", refreshUnits);

    g.events.on("turnStarted", ({ detail: { who } }) => {
      activeCombatant.value = who;
      hideActionMenu();

      allActions.value = [];
      void g.getActions(who).then((actions) => (allActions.value = actions));
    });

    onMount?.(g);
  }, [g, hideActionMenu, onMount, refreshUnits]);

  const onClickAction = useCallback(
    (action: Action) => {
      hideActionMenu();

      const point = target ? g.getState(target).position : undefined;
      const config = { target, point };
      if (checkConfig(action, config)) {
        void action.apply(config);
      } else console.warn(config, "does not match", action.config);
    },
    [g, hideActionMenu, target]
  );

  const onClickBattlefield = useCallback(() => {
    // TODO show actions for this square?
    hideActionMenu();
  }, [hideActionMenu]);

  const onClickCombatant = useCallback(
    (who: Combatant, e: MouseEvent) => {
      e.stopPropagation();

      if (activeCombatant.value) {
        setTarget(who);

        const items = allActions.value.map((action) => ({
          label: action.name,
          value: action,
          disabled: !checkConfig(action, {
            target: who,
            point: g.getState(who).position,
          }),
        }));

        setActionMenu({ show: true, x: e.clientX, y: e.clientY, items });
      }
    },
    [activeCombatant.value, allActions.value, g]
  );

  const onMoveCombatant = useCallback(
    (who: Combatant, dx: number, dy: number) => {
      hideActionMenu();
      g.move(who, dx, dy);
    },
    [g, hideActionMenu]
  );

  const onPass = useCallback(() => {
    void g.nextTurn();
  }, [g]);

  return (
    <div className={styles.main}>
      <Battlefield
        onClickBattlefield={onClickBattlefield}
        onClickCombatant={onClickCombatant}
        onMoveCombatant={onMoveCombatant}
      />
      {actionMenu.show && <Menu {...actionMenu} onClick={onClickAction} />}
      <ActiveUnitPanelContainer onPass={onPass} />
      <EventLog g={g} />
    </div>
  );
}
