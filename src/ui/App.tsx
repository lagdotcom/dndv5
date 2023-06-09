import { useCallback, useContext, useEffect, useState } from "preact/hooks";

import Engine from "../Engine";
import { getDefaultMovement } from "../movement";
import Action from "../types/Action";
import Combatant from "../types/Combatant";
import MoveDirection from "../types/MoveDirection";
import Point from "../types/Point";
import { checkConfig } from "../utils/config";
import ActiveUnitPanel from "./ActiveUnitPanel";
import styles from "./App.module.scss";
import Battlefield from "./Battlefield";
import BoundedMovePanel from "./BoundedMovePanel";
import ChooseActionConfigPanel from "./ChooseActionConfigPanel";
import EventLog from "./EventLog";
import ListChoiceDialog from "./ListChoiceDialog";
import Menu, { MenuItem } from "./Menu";
import MultiListChoiceDialog from "./MultiListChoiceDialog";
import { getAllIcons } from "./utils/icons";
import {
  actionAreas,
  activeCombatant,
  activeCombatantId,
  allActions,
  allCombatants,
  allEffects,
  chooseFromList,
  chooseManyFromList,
  chooseYesNo,
  moveBounds,
  moveHandler,
  movingCombatantId,
  wantsCombatant,
  wantsPoint,
} from "./utils/state";
import { SVGCacheContext } from "./utils/SVGCache";
import { getUnitData, UnitData } from "./utils/types";
import YesNoDialog from "./YesNoDialog";

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
  const cache = useContext(SVGCacheContext);
  const [target, setTarget] = useState<Combatant>();
  const [action, setAction] = useState<Action>();
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
    const list: UnitData[] = [];
    for (const [who, state] of g.combatants) list.push(getUnitData(who, state));
    allCombatants.value = list;
  }, [g]);

  const refreshAreas = useCallback(() => {
    allEffects.value = Array.from(g.effects);
  }, [g]);

  useEffect(() => {
    g.events.on("CombatantPlaced", refreshUnits);
    g.events.on("CombatantMoved", refreshUnits);
    g.events.on("CombatantDied", refreshUnits);

    g.events.on("AreaPlaced", refreshAreas);
    g.events.on("AreaRemoved", refreshAreas);

    g.events.on("TurnStarted", ({ detail: { who } }) => {
      activeCombatantId.value = who.id;
      moveHandler.value = getDefaultMovement(who);
      movingCombatantId.value = who.id;
      hideActionMenu();

      allActions.value = g.getActions(who);
    });

    g.events.on("ListChoice", (e) => (chooseFromList.value = e));
    g.events.on("MultiListChoice", (e) => (chooseManyFromList.value = e));
    g.events.on("YesNoChoice", (e) => (chooseYesNo.value = e));

    g.events.on("BoundedMove", (e) => {
      moveBounds.value = e;
      moveHandler.value = e.detail.handler;
      movingCombatantId.value = e.detail.who.id;
    });

    onMount?.(g);

    for (const iconUrl of getAllIcons(g)) cache.get(iconUrl);
  }, [cache, g, hideActionMenu, onMount, refreshAreas, refreshUnits]);

  const onExecuteAction = useCallback(
    <T extends object>(action: Action<T>, config: T) => {
      setAction(undefined);
      actionAreas.value = undefined;
      void g.act(action, config).then(() => {
        refreshUnits();
        allActions.value = g.getActions(action.actor);
        return;
      });
    },
    [g, refreshUnits]
  );

  const onClickAction = useCallback(
    (action: Action) => {
      hideActionMenu();
      setAction(undefined);

      const point = target ? g.getState(target).position : undefined;
      const config = { target, point };
      if (checkConfig(g, action, config)) {
        onExecuteAction(action, config);
      } else console.warn(config, "does not match", action.getConfig(config));
    },
    [g, hideActionMenu, onExecuteAction, target]
  );

  const onClickBattlefield = useCallback(
    (p: Point) => {
      const givePoint = wantsPoint.peek();
      if (givePoint) {
        givePoint(p);
        return;
      }

      hideActionMenu();
      actionAreas.value = undefined;
    },
    [hideActionMenu]
  );

  const onClickCombatant = useCallback(
    (who: Combatant, e: MouseEvent) => {
      e.stopPropagation();

      const giveCombatant = wantsCombatant.peek();
      if (giveCombatant) {
        giveCombatant(who);
        return;
      }

      const givePoint = wantsPoint.peek();
      if (givePoint) {
        givePoint(g.getState(who).position);
        return;
      }

      setAction(undefined);
      actionAreas.value = undefined;

      const me = activeCombatant.value;
      if (me) {
        setTarget(who);

        const items = allActions.value
          .map((action) => {
            const testConfig = { target: who, point: g.getState(who).position };
            const invalidConfig = !checkConfig(g, action, testConfig);
            const config = action.getConfig(testConfig);
            const needsTarget = "target" in config || me.who === who;
            const needsPoint = "point" in config;

            return {
              label: action.name,
              value: action,
              disabled: invalidConfig || (!needsTarget && !needsPoint),
            };
          })
          // TODO would this be useful at some point?
          .filter((item) => !item.disabled);

        setActionMenu({ show: true, x: e.clientX, y: e.clientY, items });
      }
    },
    [g]
  );

  const onFinishBoundedMove = useCallback(() => {
    if (moveBounds.value) {
      moveBounds.value.detail.resolve();
      moveBounds.value = undefined;
      if (g.activeCombatant) {
        movingCombatantId.value = g.activeCombatant.id;
        moveHandler.value = getDefaultMovement(g.activeCombatant);
      }
    }
  }, [g]);

  const onMoveCombatant = useCallback(
    (who: Combatant, dir: MoveDirection) => {
      if (moveHandler.value) {
        hideActionMenu();
        void g.move(who, dir, moveHandler.value).then((result) => {
          if (result.type === "error") console.warn(result.error.messages);
          else if (result.type === "unbind") onFinishBoundedMove();
          return result;
        });
      }
    },
    [g, hideActionMenu, onFinishBoundedMove]
  );

  const onPass = useCallback(() => {
    setAction(undefined);
    actionAreas.value = undefined;
    void g.nextTurn();
  }, [g]);

  const onCancelAction = useCallback(() => {
    setAction(undefined);
    actionAreas.value = undefined;
  }, []);

  const onChooseAction = useCallback(
    (action: Action) => {
      hideActionMenu();
      setAction(action);
    },
    [hideActionMenu]
  );

  return (
    <div className={styles.main}>
      <Battlefield
        onClickBattlefield={onClickBattlefield}
        onClickCombatant={onClickCombatant}
        onMoveCombatant={onMoveCombatant}
      />
      {actionMenu.show && (
        <Menu caption="Quick Actions" {...actionMenu} onClick={onClickAction} />
      )}
      <div className={styles.sidePanel}>
        {activeCombatant.value && (
          <ActiveUnitPanel
            who={activeCombatant.value}
            onPass={onPass}
            onChooseAction={onChooseAction}
          />
        )}
        {action && (
          <ChooseActionConfigPanel
            g={g}
            action={action}
            onCancel={onCancelAction}
            onExecute={onExecuteAction}
          />
        )}
        {moveBounds.value && (
          <BoundedMovePanel
            bounds={moveBounds.value.detail}
            onFinish={onFinishBoundedMove}
          />
        )}
      </div>
      <EventLog g={g} />
      {chooseFromList.value && (
        <ListChoiceDialog {...chooseFromList.value.detail} />
      )}
      {chooseManyFromList.value && (
        <MultiListChoiceDialog {...chooseManyFromList.value.detail} />
      )}
      {chooseYesNo.value && <YesNoDialog {...chooseYesNo.value.detail} />}
    </div>
  );
}
