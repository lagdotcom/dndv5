import { BoundedMoveDetail } from "../events/BoundedMoveEvent";
import commonStyles from "./common.module.scss";
import Labelled from "./Labelled";

interface Props {
  bounds: BoundedMoveDetail;
  onFinish(): void;
}

export default function BoundedMovePanel({ bounds, onFinish }: Props) {
  // TODO allow finishing if unable to move

  return (
    <aside className={commonStyles.panel} aria-label="Bounded Movement">
      <Labelled label={bounds.handler.name}>{bounds.who.name}</Labelled>
      <div>Move up to {bounds.handler.maximum} feet.</div>
      <button onClick={onFinish} disabled={bounds.handler.mustUseAll}>
        End Movement Early
      </button>
    </aside>
  );
}
