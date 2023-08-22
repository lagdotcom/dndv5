import Action from "../types/Action";
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

export default function ActiveUnitPanel({
  onChooseAction,
  onPass,
  who,
}: Props) {
  return (
    <aside className={commonStyles.panel} aria-label="Active Unit">
      <Labelled label="Current Turn">{who.name}</Labelled>
      <button onClick={onPass}>End Turn</button>
      <hr />
      <Labelled label="Actions">
        {allActions.value.map((action) =>
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
    </aside>
  );
}
