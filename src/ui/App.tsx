import { useCallback, useEffect, useState } from "preact/hooks";

import Engine from "../Engine";
import Action from "../types/Action";
import Combatant from "../types/Combatant";
import CombatantState from "../types/CombatantState";
import { checkConfig } from "../utils/config";
import ActiveUnitPanelContainer from "./ActiveUnitPanelContainer";
import styles from "./App.module.scss";
import Battlefield from "./Battlefield";
import Menu, { MenuItem } from "./Menu";
import { activeCombatant, allActions } from "./state";

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
  const [units, setUnits] = useState(
    () => new Map<Combatant, CombatantState>()
  );
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

  const updateUnits = useCallback(
    (updateFn: (units: Map<Combatant, CombatantState>) => void) =>
      setUnits((old) => {
        const map = new Map(old);
        updateFn(map);
        return map;
      }),
    [setUnits]
  );

  useEffect(() => {
    g.events.on("combatantPlaced", ({ detail: { who, position } }) =>
      updateUnits((map) => map.set(who, { position, initiative: NaN }))
    );

    g.events.on("combatantMoved", ({ detail: { who, position } }) =>
      updateUnits((map) => map.set(who, { position, initiative: NaN }))
    );

    g.events.on("combatantDied", ({ detail: { who } }) => {
      updateUnits((map) => map.delete(who));
    });

    g.events.on("turnStarted", ({ detail: { who } }) => {
      activeCombatant.value = who;
      hideActionMenu();

      void g.getActions(who).then((actions) => (allActions.value = actions));
    });

    onMount?.(g);
  }, [g, hideActionMenu, onMount, updateUnits]);

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
    (who: Combatant, dx: number, dy: number) => g.move(who, dx, dy),
    [g]
  );

  const onPass = useCallback(() => {
    void g.nextTurn();
  }, [g]);

  return (
    <div className={styles.main}>
      <Battlefield
        units={units}
        onClickBattlefield={onClickBattlefield}
        onClickCombatant={onClickCombatant}
        onMoveCombatant={onMoveCombatant}
      />
      {actionMenu.show && <Menu {...actionMenu} onClick={onClickAction} />}
      <ActiveUnitPanelContainer onPass={onPass} />
    </div>
  );
}
