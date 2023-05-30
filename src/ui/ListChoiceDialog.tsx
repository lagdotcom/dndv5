import { useCallback } from "preact/hooks";

import EventData from "../events/EventData";
import Dialog from "./Dialog";
import { chooseFromList } from "./utils/state";

export default function ListChoiceDialog({
  interruption,
  resolve,
}: EventData["listChoice"]) {
  const decide = useCallback(
    (value: unknown) => {
      chooseFromList.value = undefined;
      resolve(value);
    },
    [resolve]
  );

  return (
    <Dialog title={interruption.title} text={interruption.text}>
      {[...interruption.items].map(([label, value]) => (
        <button onClick={() => decide(value)}>{label}</button>
      ))}
    </Dialog>
  );
}
