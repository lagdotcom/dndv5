import BattleTemplate, {
  initialiseFromTemplate,
} from "../../data/BattleTemplate";
import Engine, { EngineMoveResult } from "../../Engine";
import { getDefaultMovement } from "../../movement";
import Action from "../../types/Action";
import Combatant from "../../types/Combatant";
import { SpecifiedEffectShape } from "../../types/EffectArea";
import MoveDirection from "../../types/MoveDirection";
import Point from "../../types/Point";
import { resolveArea } from "../../utils/areas";
import { checkConfig } from "../../utils/config";
import useMenu from "../hooks/useMenu";
import { batch, useCallback, useContext, useEffect, useState } from "../lib";
import { getAllIcons } from "../utils/icons";
import {
  actionAreas,
  activeCombatant,
  activeCombatantId,
  allActions,
  allCombatants,
  allEffects,
  canMoveDirections,
  chooseFromList,
  chooseManyFromList,
  chooseYesNo,
  moveBounds,
  moveHandler,
  movingCombatantId,
  resetAllState,
  showSideHP,
  showSideUnderlay,
  teleportInfo,
  wantsCombatant,
  wantsPoint,
} from "../utils/state";
import { SVGCacheContext } from "../utils/SVGCache";
import { getUnitData } from "../utils/types";
import UIResponse from "../utils/UIResponse";
import ActiveUnitPanel from "./ActiveUnitPanel";
import Battlefield from "./Battlefield";
import BoundedMovePanel from "./BoundedMovePanel";
import ChooseActionConfigPanel from "./ChooseActionConfigPanel";
import styles from "./CombatUI.module.scss";
import EventLog from "./EventLog";
import ListChoiceDialog from "./ListChoiceDialog";
import Menu from "./Menu";
import MultiListChoiceDialog from "./MultiListChoiceDialog";
import YesNoDialog from "./YesNoDialog";

interface Props {
  g: Engine;
  template?: BattleTemplate;
}

export default function CombatUI({ g, template }: Props) {
  const cache = useContext(SVGCacheContext);
  const [action, setAction] = useState<Action>();

  const refreshMoveDirections = useCallback(() => {
    const unit = activeCombatant.value;
    const handler = moveHandler.value;

    if (unit && handler) {
      canMoveDirections.value = [];
      return g
        .getValidMoves(unit.who, handler)
        .then((valid) => (canMoveDirections.value = valid));
    }
  }, [g]);

  const refreshUnits = useCallback(() => {
    allCombatants.value = Array.from(g.combatants, getUnitData);
    refreshMoveDirections();
    // TODO
    // if (g.activeCombatant) {
    //   const evaluations = Array.from(
    //     getAllEvaluations(g, g.activeCombatant),
    //   ).sort((a, b) => b.score.result - a.score.result);
    //   aiEvaluation.value = evaluations[0];
    // } else aiEvaluation.value = undefined;
  }, [g, refreshMoveDirections]);

  const refreshAreas = useCallback(() => {
    allEffects.value = Array.from(g.effects);
  }, [g]);

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

  const processMove = useCallback(
    (mover: EngineMoveResult) => {
      void mover.then((result) => {
        if (result.type === "error") console.warn(result.error.messages);
        else if (result.type === "unbind") onFinishBoundedMove();
        return result;
      });
    },
    [onFinishBoundedMove],
  );

  const onExecuteAction = useCallback(
    <T extends object>(action: Action<T>, config: T) => {
      setAction(undefined);
      actionAreas.value = undefined;
      void g.act(action, config).then(() => {
        refreshUnits();
        const actions = g.getActions(action.actor);
        allActions.value = actions;
        return actions;
      });
    },
    [g, refreshUnits],
  );

  const menu = useMenu<Action, Combatant>("Quick Actions", (choice, target) => {
    setAction(undefined);

    const point = target.position;
    const config = { target, point };
    if (checkConfig(g, choice, config)) {
      onExecuteAction(choice, config);
    } else console.warn(config, "does not match", choice.getConfig(config));
  });

  useEffect(() => {
    resetAllState(() => {
      showSideHP.value = [0];
      showSideUnderlay.value = false;
    });

    g.events.on("CombatantPlaced", refreshUnits);
    g.events.on("CombatantMoved", refreshUnits);
    g.events.on("CombatantDied", refreshUnits);
    g.events.on("EffectAdded", refreshUnits);
    g.events.on("EffectRemoved", refreshUnits);
    g.events.on("AreaPlaced", refreshAreas);
    g.events.on("AreaRemoved", refreshAreas);
    g.events.on("TurnStarted", ({ detail: { who, interrupt } }) => {
      interrupt.add(
        new UIResponse(who, async () => {
          batch(() => {
            activeCombatantId.value = who.id;
            moveHandler.value = getDefaultMovement(who);
            movingCombatantId.value = who.id;
            menu.hide();

            refreshUnits();
            allActions.value = g.getActions(who);
          });
        }),
      );
    });
    g.events.on("ListChoice", (e) => (chooseFromList.value = e));
    g.events.on("MultiListChoice", (e) => (chooseManyFromList.value = e));
    g.events.on("YesNoChoice", (e) => (chooseYesNo.value = e));
    g.events.on("BoundedMove", (e) => {
      const { who, handler } = e.detail;

      batch(() => {
        moveBounds.value = e;
        moveHandler.value = handler;
        movingCombatantId.value = who.id;

        if (handler.teleportation) {
          const shape: SpecifiedEffectShape = {
            type: "within",
            who,
            radius: handler.maximum,
          };
          teleportInfo.value = shape;
          const area = resolveArea(shape);

          wantsPoint.value = (p) => {
            if (p && area.has(p)) {
              processMove(g.move(who, p, handler));

              batch(() => {
                wantsPoint.value = undefined;
                teleportInfo.value = undefined;
              });
            }
          };
        }
      });
    });

    if (template)
      void initialiseFromTemplate(g, template).then((arg) => {
        for (const iconUrl of getAllIcons(g)) cache.get(iconUrl);
        return arg;
      });

    return g.reset.bind(g);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cache, g, processMove, refreshAreas, refreshUnits, template]);

  const onClickBattlefield = useCallback(
    (p: Point) => {
      const givePoint = wantsPoint.peek();
      if (givePoint) {
        givePoint(p);
        return;
      }

      menu.hide();
      actionAreas.value = undefined;
    },
    [menu],
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
        givePoint(who.position);
        return;
      }

      setAction(undefined);
      actionAreas.value = undefined;

      const me = activeCombatant.value;
      if (me && !moveBounds.peek()) {
        menu.show(
          e,
          allActions.value
            .map((action) => {
              const testConfig = { target: who, point: who.position };
              const invalidConfig = !checkConfig(g, action, testConfig);
              const config = action.getConfig(testConfig);
              const needsTarget = "target" in config || me.who === who;
              const needsPoint = "point" in config;
              const isReaction = action.getTime(testConfig) === "reaction";

              return {
                label: action.name,
                value: action,
                disabled:
                  invalidConfig || isReaction || (!needsTarget && !needsPoint),
              };
            })
            // TODO would this be useful at some point?
            .filter((item) => !item.disabled),
          who,
        );
      }
    },
    [g, menu],
  );

  const onMoveCombatant = useCallback(
    (who: Combatant, dir: MoveDirection) => {
      if (moveHandler.value) {
        menu.hide();
        processMove(g.moveInDirection(who, dir, moveHandler.value));
      }
    },
    [g, menu, processMove],
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
      menu.hide();
      setAction(action);
    },
    [menu],
  );

  return (
    <div className={styles.main}>
      <Battlefield
        onClickBattlefield={onClickBattlefield}
        onClickCombatant={onClickCombatant}
        onMoveCombatant={onMoveCombatant}
      />
      {menu.isShown && <Menu {...menu.props} />}
      <div className={styles.sidePanel}>
        {moveBounds.value ? (
          <BoundedMovePanel
            bounds={moveBounds.value.detail}
            onFinish={onFinishBoundedMove}
          />
        ) : (
          <>
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
          </>
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
