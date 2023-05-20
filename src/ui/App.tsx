import { useCallback, useEffect, useState } from "preact/hooks";

import Engine from "../Engine";
import Action from "../types/Action";
import Combatant from "../types/Combatant";
import CombatantState from "../types/CombatantState";
import { checkConfig } from "../utils/config";
import styles from "./App.module.scss";
import Battlefield from "./Battlefield";
import Menu from "./Menu";

interface Props {
  g: Engine;
  onMount?: (g: Engine) => void;
}

interface ActionMenuState {
  show: boolean;
  x: number;
  y: number;
  items: { label: string; value: Action }[];
}

export default function App({ g, onMount }: Props) {
  const [active, setActive] = useState<Combatant>();
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
      setActive(who);
      hideActionMenu();
    });

    onMount?.(g);
  }, [g, hideActionMenu, onMount, updateUnits]);

  const onClickAction = useCallback(
    (action: Action) => {
      hideActionMenu();

      const config = { target };
      if (checkConfig(action, config)) {
        void action.apply(g, config);
      } else console.warn(config, "does not match", action.config);
    },
    [g, hideActionMenu, target]
  );

  const onClickBattlefield = useCallback(
    (e: MouseEvent) => {
      hideActionMenu();
    },
    [hideActionMenu]
  );

  const onClickCombatant = useCallback(
    (who: Combatant, e: MouseEvent) => {
      e.stopPropagation();

      if (active) {
        setTarget(who);
        void g.getActions(active, who).then((actions) => {
          setActionMenu({
            show: true,
            x: e.clientX,
            y: e.clientY,
            items: actions.map((a) => ({ label: a.name, value: a })),
          });
          return actions;
        });
      }
    },
    [active, g]
  );

  const onMoveCombatant = useCallback(
    (who: Combatant, dx: number, dy: number) => g.move(who, dx, dy),
    [g]
  );

  return (
    <div className={styles.main}>
      <Battlefield
        active={active}
        units={units}
        onClickBattlefield={onClickBattlefield}
        onClickCombatant={onClickCombatant}
        onMoveCombatant={onMoveCombatant}
      />
      {actionMenu.show && <Menu {...actionMenu} onClick={onClickAction} />}
    </div>
  );
}
