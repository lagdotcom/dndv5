import BoundedMoveEvent from "../events/BoundedMoveEvent";
import commonStyles from "./common.module.scss";
import Labelled from "./Labelled";

interface Props {
  bounds: BoundedMoveEvent;
  onFinish(): void;
}

export default function BoundedMovePanel({ bounds, onFinish }: Props) {
  return (
    <aside className={commonStyles.panel} aria-label="Bounded Movement">
      <Labelled label={bounds.detail.handler.name}>
        {bounds.detail.who.name}
      </Labelled>
      <div>Move up to {bounds.detail.handler.maximum} feet.</div>
      <button onClick={onFinish}>End Movement Early</button>
    </aside>
  );
}
