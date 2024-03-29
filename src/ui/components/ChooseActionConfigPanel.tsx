import Engine from "../../Engine";
import Action, { ActionConfig, GetActionConfig } from "../../types/Action";
import Amount from "../../types/Amount";
import DamageType from "../../types/DamageType";
import { checkConfig, getConfigErrors } from "../../utils/config";
import { getDiceAverage } from "../../utils/dnd";
import { objectEntries } from "../../utils/objects";
import { isDefined } from "../../utils/types";
import usePatcher from "../hooks/usePatcher";
import { useCallback, useEffect, useMemo } from "../lib";
import { actionAreas } from "../utils/state";
import { UnitData } from "../utils/types";
import styles from "./ChooseActionConfigPanel.module.scss";
import commonStyles from "./common.module.scss";
import ConfigComponents from "./ConfigComponents";
import Labelled from "./Labelled";

function getInitialConfig<T extends object>(
  getConfig: GetActionConfig<T>,
  initial?: Partial<T>,
): Partial<T> {
  const config: Partial<T> = { ...initial };

  for (const [key, resolver] of objectEntries<ActionConfig<T>>(
    getConfig(config),
  ))
    if (isDefined(resolver.initialValue)) config[key] = resolver.initialValue;

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
  const getConfig = useMemo(() => action.getConfig.bind(action), [action]);
  const [config, patchConfig] = usePatcher(
    getInitialConfig(getConfig, initialConfig),
  );

  useEffect(() => {
    actionAreas.value = action.getAffectedArea(config);
  }, [action, active, config]);

  const {
    name,
    errors,
    disabled,
    damage,
    description,
    heal,
    isReaction,
    time,
  } = useMemo(() => {
    const name = action.name;
    const errors = getConfigErrors(g, action, config).messages;
    const disabled = errors.length > 0;
    const damage = action.getDamage(config);
    const description = action.getDescription(config);
    const heal = action.getHeal(config);
    const rawTime = action.getTime(config);
    const time = action.tags.has("costs attack")
      ? "attack"
      : rawTime ?? "no cost";
    const isReaction = rawTime === "reaction";

    return {
      name,
      errors,
      disabled,
      damage,
      description,
      heal,
      time,
      isReaction,
    };
  }, [action, config, g]);

  const execute = useCallback(() => {
    if (checkConfig(g, action, config)) onExecute(action, config);
  }, [g, action, config, onExecute]);

  const statusWarning = useMemo(
    () =>
      action.status === "incomplete" ? (
        <div className={styles.warning}>Incomplete implementation</div>
      ) : action.status === "missing" ? (
        <div className={styles.warning}>Not implemented</div>
      ) : null,
    [action.status],
  );

  return (
    <aside className={commonStyles.panel} aria-label="Action Options">
      <div className={styles.namePanel}>
        <div className={styles.name}>{name}</div>
        <div className={styles.time}>{time}</div>
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
