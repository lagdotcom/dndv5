import { useMemo } from "preact/hooks";

import Action from "../types/Action";
import ActionTime from "../types/ActionTime";
import commonStyles from "./common.module.scss";
import IconButton from "./IconButton";
import Labelled from "./Labelled";
import { allActions } from "./utils/state";
import { UnitData } from "./utils/types";

interface Props {
  onChooseAction(action: Action): void;
  onPass(): void;
  who: UnitData;
}

export const ActionTypes = [
  "Attacks",
  "Actions",
  "Bonus Actions",
  "Other Actions",
  "Reactions",
  "Out of Combat Actions",
] as const;
export type ActionType = (typeof ActionTypes)[number];

const niceTime: Record<ActionTime, ActionType> = {
  action: "Actions",
  "bonus action": "Bonus Actions",
  long: "Out of Combat Actions",
  reaction: "Reactions",
};

function splitActions(actionList: Action[]) {
  const categories = new Map<ActionType, Action[]>();

  for (const action of actionList) {
    const time = action.getTime({});
    const label = action.isAttack
      ? "Attacks"
      : time
      ? niceTime[time]
      : "Other Actions";

    const category = categories.get(label) ?? [];
    category.push(action);
    if (!categories.has(label)) categories.set(label, category);
  }

  return Array.from(categories, ([label, actions]) => ({
    label,
    actions,
  })).sort(
    (a, b) => ActionTypes.indexOf(a.label) - ActionTypes.indexOf(b.label),
  );
}

export default function ActiveUnitPanel({
  onChooseAction,
  onPass,
  who,
}: Props) {
  const actionCategories = splitActions(allActions.value);

  return (
    <aside className={commonStyles.panel} aria-label="Active Unit">
      <Labelled label="Current Turn">{who.name}</Labelled>
      <button onClick={onPass}>End Turn</button>
      <hr />

      {actionCategories.map(({ label, actions }) => (
        <Labelled key={label} label={label}>
          {actions.map((action) =>
            action.icon ? (
              <IconButton
                key={action.name}
                onClick={() => onChooseAction(action)}
                icon={action.icon}
                sub={action.subIcon}
                alt={action.name}
              />
            ) : (
              <button key={action.name} onClick={() => onChooseAction(action)}>
                {action.name}
              </button>
            ),
          )}
        </Labelled>
      ))}
    </aside>
  );
}
