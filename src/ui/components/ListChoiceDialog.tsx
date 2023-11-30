import { useCallback } from "preact/hooks";

import { ListChoiceDetail } from "../../events/ListChoiceEvent";
import { chooseFromList } from "../utils/state";
import Dialog from "./Dialog";

export default function ListChoiceDialog<T>({
  interruption,
  resolve,
}: ListChoiceDetail<T>) {
  const decide = useCallback(
    (value?: T) => {
      chooseFromList.value = undefined;
      resolve(value);
    },
    [resolve],
  );

  return (
    <Dialog title={interruption.title} text={interruption.text}>
      {interruption.items.map(({ label, value, disabled }) => (
        <button key={label} disabled={disabled} onClick={() => decide(value)}>
          {label}
        </button>
      ))}
      {interruption.allowNone && (
        <button onClick={() => decide()}>(None)</button>
      )}
    </Dialog>
  );
}
