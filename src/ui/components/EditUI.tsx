import allMonsters, { MonsterName } from "../../data/allMonsters";
import { PCName } from "../../data/allPCs";
import BattleTemplate, {
  BattleTemplateEntry,
  initialiseFromTemplate,
} from "../../data/BattleTemplate";
import Engine from "../../Engine";
import { SideID } from "../../flavours";
import Combatant from "../../types/Combatant";
import Point from "../../types/Point";
import { exceptFor, patchAt } from "../../utils/array";
import { enumerate } from "../../utils/numbers";
import { isDefined } from "../../utils/types";
import useMenu from "../hooks/useMenu";
import {
  StateUpdater,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "../lib";
import {
  allCombatants,
  canDragUnits,
  resetAllState,
  showSideHP,
  showSideUnderlay,
} from "../utils/state";
import { getUnitData } from "../utils/types";
import AddMonsterDialog from "./AddMonsterDialog";
import AddPCDialog from "./AddPCDialog";
import Battlefield from "./Battlefield";
import buttonStyles from "./button.module.scss";
import ConfigureMonsterDialog from "./ConfigureMonsterDialog";
import Menu, { MenuItem } from "./Menu";

interface EditUIProps {
  g: Engine;
  template: BattleTemplate;
  onUpdate: StateUpdater<BattleTemplate>;
}

type UnitAction =
  | { type: "side"; side: SideID }
  | { type: "remove" }
  | { type: "configure" }
  | { type: "pc"; pos: Point }
  | { type: "monster"; pos: Point };

const sideItem = (side: SideID, current: SideID): MenuItem<UnitAction> => ({
  label: side === 0 ? "Ally" : side === 1 ? "Enemy" : `Side #${side}`,
  value: { type: "side", side },
  disabled: side === current,
});

const isConfigurable = (entry: BattleTemplateEntry) =>
  entry.type === "monster" && isDefined(allMonsters[entry.name].config);

function useConfiguring(
  template: BattleTemplate,
  onUpdate: StateUpdater<BattleTemplate>,
) {
  const [index, select] = useState<number>();
  const finish = () => select(undefined);

  const entry = useMemo(() => {
    if (index) {
      const e = template.combatants[index];
      if (e.type === "monster") return e;
    }
  }, [index, template.combatants]);

  const patch = useCallback(
    (key: string, value: unknown) => {
      if (isDefined(index))
        onUpdate((old) => ({
          ...old,
          combatants: patchAt(old.combatants, index, (entry) =>
            entry.type === "monster"
              ? {
                  ...entry,
                  config: { ...(entry.config ?? {}), [key]: value },
                }
              : entry,
          ),
        }));
    },
    [index, onUpdate],
  );

  return { entry, select, patch, finish };
}

export default function EditUI({ g, template, onUpdate }: EditUIProps) {
  useEffect(() => {
    void initialiseFromTemplate(g, template).then((arg) => {
      resetAllState(() => {
        allCombatants.value = Array.from(g.combatants, getUnitData);
        canDragUnits.value = true;
        showSideHP.value = enumerate(0, 9);
        showSideUnderlay.value = true;
      });
      return arg;
    });

    return g.reset.bind(g);
  }, [g, template]);

  const [destination, setDestination] = useState<Point>({ x: NaN, y: NaN });
  const [add, setAdd] = useState<"monster" | "pc">();

  const onCancelAdd = () => setAdd(undefined);
  const onAddMonster = (name: MonsterName) => {
    setAdd(undefined);
    onUpdate((old) => ({
      ...old,
      combatants: old.combatants.concat({
        type: "monster",
        name,
        x: destination.x,
        y: destination.y,
        config: allMonsters[name].config?.initial,
      }),
    }));
  };
  const onAddPC = (name: PCName) => {
    setAdd(undefined);
    onUpdate((old) => ({
      ...old,
      combatants: old.combatants.concat({
        type: "pc",
        name,
        x: destination.x,
        y: destination.y,
      }),
    }));
  };

  const {
    select: configure,
    entry: configuring,
    finish: onFinishConfig,
    patch: onPatchConfig,
  } = useConfiguring(template, onUpdate);

  const menu = useMenu<UnitAction, number>(
    "Unit Actions",
    useCallback(
      (action, index) => {
        switch (action.type) {
          case "side":
            return onUpdate((old) => ({
              ...old,
              combatants: patchAt(old.combatants, index, (e) => ({
                ...e,
                side: action.side,
              })),
            }));

          case "remove":
            return onUpdate((old) => ({
              ...old,
              combatants: exceptFor(old.combatants, index),
            }));

          case "monster":
          case "pc":
            setDestination(action.pos);
            setAdd(action.type);
            return;

          case "configure":
            configure(index);
            return;
        }
      },
      [onUpdate, configure],
    ),
  );

  const onClickCombatant = useCallback(
    (who: Combatant, e: MouseEvent) => {
      e.stopPropagation();
      const index = who.id - 1;
      menu.show(
        e,
        [
          sideItem(0, who.side),
          sideItem(1, who.side),
          sideItem(2, who.side),
          {
            label: "Configure...",
            value: { type: "configure" },
            disabled: !isConfigurable(template.combatants[index]),
          },
          {
            label: "Remove",
            value: { type: "remove" },
            className: buttonStyles.danger,
          },
        ],
        index,
      );
    },
    [menu, template.combatants],
  );

  const onDragCombatant = useCallback(
    (who: Combatant, { x, y }: Point) => {
      onUpdate((old) => ({
        ...old,
        combatants: patchAt(old.combatants, who.id - 1, (e) => ({
          ...e,
          x,
          y,
        })),
      }));
    },
    [onUpdate],
  );

  const onClickBattlefield = useCallback(
    (pos: Point, e: MouseEvent) => {
      if (menu.isShown) menu.hide();
      else
        menu.show(e, [
          { label: "Add PC", value: { type: "pc", pos } },
          { label: "Add Monster", value: { type: "monster", pos } },
        ]);
    },
    [menu],
  );

  return (
    <>
      <Battlefield
        showHoveredTile
        onClickBattlefield={onClickBattlefield}
        onClickCombatant={onClickCombatant}
        onDragCombatant={onDragCombatant}
        images={template.images}
      />
      {menu.isShown && <Menu {...menu.props} />}
      {add === "monster" && (
        <AddMonsterDialog onChoose={onAddMonster} onCancel={onCancelAdd} />
      )}
      {add === "pc" && (
        <AddPCDialog onChoose={onAddPC} onCancel={onCancelAdd} />
      )}
      {configuring && (
        <ConfigureMonsterDialog
          g={g}
          name={configuring.name}
          config={configuring.config ?? {}}
          onFinished={onFinishConfig}
          patchConfig={onPatchConfig}
        />
      )}
    </>
  );
}
