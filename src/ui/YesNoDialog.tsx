import { useCallback } from "preact/hooks";

import { YesNoChoiceDetail } from "../events/YesNoChoiceEvent";
import Dialog from "./Dialog";
import { chooseYesNo } from "./utils/state";

export default function YesNoDialog({
  interruption,
  resolve,
}: YesNoChoiceDetail) {
  const decide = useCallback(
    (value: boolean) => {
      chooseYesNo.value = undefined;
      resolve(value);
    },
    [resolve]
  );

  const onYes = useCallback(() => decide(true), [decide]);
  const onNo = useCallback(() => decide(false), [decide]);

  return (
    <Dialog title={interruption.title} text={interruption.text}>
      <button onClick={onYes}>Yes</button>
      <button onClick={onNo}>No</button>
    </Dialog>
  );
}
