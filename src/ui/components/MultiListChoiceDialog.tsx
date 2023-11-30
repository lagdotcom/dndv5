import { useCallback } from "preact/hooks";

import { MultiListChoiceDetail } from "../../events/MultiListChoiceEvent";
import useList from "../hooks/useList";
import classnames from "../utils/classnames";
import { chooseManyFromList } from "../utils/state";
import buttonStyles from "./button.module.scss";
import Dialog from "./Dialog";

export default function MultiListChoiceDialog<T>({
  interruption,
  resolve,
}: MultiListChoiceDetail<T>) {
  const { list, toggle } = useList<T>();
  const invalidSelection =
    list.length < interruption.minimum || list.length > interruption.maximum;

  const decide = useCallback(() => {
    chooseManyFromList.value = undefined;
    resolve(list);
  }, [list, resolve]);

  return (
    <Dialog title={interruption.title} text={interruption.text}>
      <div>
        Choose between {interruption.minimum} and {interruption.maximum}{" "}
        inclusive.
      </div>
      {interruption.items.map(({ label, value, disabled }) => (
        <button
          key={label}
          className={classnames({
            [buttonStyles.active]: list.includes(value),
          })}
          disabled={disabled}
          onClick={() => toggle(value)}
        >
          {label}
        </button>
      ))}
      <button disabled={invalidSelection} onClick={decide}>
        OK
      </button>
    </Dialog>
  );
}
