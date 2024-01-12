import Engine from "../../Engine";
import NumberRangeResolver from "../../resolvers/NumberRangeResolver";
import SlotResolver from "../../resolvers/SlotResolver";
import Action from "../../types/Action";
import Amount from "../../types/Amount";
import DamageType from "../../types/DamageType";
import { checkConfig, getConfigErrors } from "../../utils/config";
import { getDiceAverage } from "../../utils/dnd";
import { useCallback, useEffect, useMemo, useState } from "../lib";
import { actionAreas } from "../utils/state";
import { UnitData } from "../utils/types";
import styles from "./ChooseActionConfigPanel.module.scss";
import commonStyles from "./common.module.scss";
import ConfigComponents from "./ConfigComponents";
import Labelled from "./Labelled";

function getInitialConfig<T extends object>(
  action: Action<T>,
  initial?: Partial<T>,
): Partial<T> {
  const config: Partial<T> = { ...initial };

  for (const [key, resolver] of Object.entries(action.getConfig(config))) {
    if (
      (resolver instanceof SlotResolver ||
        resolver instanceof NumberRangeResolver) &&
      !config[key as keyof T]
    )
      (config[key as keyof T] as number) = resolver.min;
  }

  return config;
}

function AmountElement({ a, type }: { a: Amount; type?: DamageType }) {
  return (
    <span>
      {a.type === "flat" ? a.amount : `${a.amount.count}d${a.amount.size}`}
      {type && " " + type}
    </span>
  );
}

function amountReducer(total: number, a: Amount) {
  return (
    total +
    (a.type === "flat"
      ? a.amount
      : getDiceAverage(a.amount.count, a.amount.size))
  );
}

interface Props<T extends object> {
  g: Engine;
  action: Action<T>;
  active?: UnitData;
  initialConfig?: Partial<T>;
  onCancel(): void;
  onExecute(action: Action<T>, config: T): void;
}
export default function ChooseActionConfigPanel<T extends object>({
  g,
  action,
  active,
  initialConfig = {},
  onCancel,
  onExecute,
}: Props<T>) {
  const [config, setConfig] = useState(getInitialConfig(action, initialConfig));
  const patchConfig = useCallback(
    (key: string, value: unknown) =>
      setConfig((old) => ({ ...old, [key]: value })),
    [],
  );
  const getConfig = useMemo(() => action.getConfig.bind(action), [action]);

  useEffect(() => {
    actionAreas.value = action.getAffectedArea(config);
  }, [action, active, config]);

  const errors = useMemo(
    () => getConfigErrors(g, action, config).messages,
    [g, action, config],
  );
  const disabled = useMemo(() => errors.length > 0, [errors]);
  const damage = useMemo(() => action.getDamage(config), [action, config]);
  const description = useMemo(
    () => action.getDescription(config),
    [action, config],
  );
  const heal = useMemo(() => action.getHeal(config), [action, config]);
  const time = useMemo(() => action.getTime(config), [action, config]);
  const isReaction = time === "reaction";

  const execute = useCallback(() => {
    if (checkConfig(g, action, config)) onExecute(action, config);
  }, [g, action, config, onExecute]);

  const statusWarning =
    action.status === "incomplete" ? (
      <div className={styles.warning}>Incomplete implementation</div>
    ) : action.status === "missing" ? (
      <div className={styles.warning}>Not implemented</div>
    ) : null;

  return (
    <aside className={commonStyles.panel} aria-label="Action Options">
      <div className={styles.namePanel}>
        <div className={styles.name}>{action.name}</div>
        <div className={styles.time}>
          {action.tags.has("costs attack") ? "attack" : time ?? "no cost"}
        </div>
      </div>
      {statusWarning}
      {description && (
        <div className={styles.description}>
          {description.split("\n").map((p, key) => (
            <p key={key}>{p}</p>
          ))}
        </div>
      )}
      {damage && (
        <div>
          Damage:{" "}
          <div className={commonStyles.damageList}>
            {damage.map((a, key) => (
              <AmountElement key={key} a={a} type={a.damageType} />
            ))}{" "}
            ({Math.ceil(damage.reduce(amountReducer, 0))})
          </div>
        </div>
      )}
      {heal && (
        <div>
          Heal:{" "}
          <div className={commonStyles.healList}>
            {heal.map((a, key) => (
              <AmountElement key={key} a={a} />
            ))}{" "}
            ({Math.ceil(heal.reduce(amountReducer, 0))})
          </div>
        </div>
      )}
      {!isReaction && (
        <>
          <button disabled={disabled} onClick={execute}>
            Execute
          </button>
          <button onClick={onCancel}>Cancel</button>
          <ConfigComponents
            config={config}
            getConfig={getConfig}
            patchConfig={patchConfig}
          />
          {errors.length > 0 && (
            <Labelled label="Errors">
              {errors.map((msg, key) => (
                <div key={key}>{msg}</div>
              ))}
            </Labelled>
          )}
        </>
      )}
    </aside>
  );
}
