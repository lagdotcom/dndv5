import { useCallback, useMemo, useState } from "preact/hooks";

import ChoiceResolver from "../resolvers/ChoiceResolver";
import MultiPointResolver from "../resolvers/MultiPointResolver";
import MultiTargetResolver from "../resolvers/MultiTargetResolver";
import PointResolver from "../resolvers/PointResolver";
import SlotResolver from "../resolvers/SlotResolver";
import TargetResolver from "../resolvers/TargetResolver";
import Action from "../types/Action";
import Combatant from "../types/Combatant";
import Point from "../types/Point";
import Resolver from "../types/Resolver";
import { check, checkConfig } from "../utils/config";
import { getDiceAverage } from "../utils/dnd";
import { enumerate } from "../utils/numbers";
import { describePoint, describeRange } from "../utils/text";
import styles from "./ChooseActionConfigPanel.module.scss";
import CombatantRef from "./CombatantRef";
import common from "./common.module.scss";
import Labelled from "./Labelled";
import classnames from "./utils/classnames";
import { actionAreas, wantsCombatant, wantsPoint } from "./utils/state";

type ChooserProps<T, R = Resolver<T>> = {
  action: Action;
  field: string;
  onChange(key: string, value?: T): void;
  resolver: R;
  value?: T;
};

function ChooseTarget({ field, value, onChange }: ChooserProps<Combatant>) {
  const setTarget = useCallback(
    (who?: Combatant) => {
      onChange(field, who);
      wantsCombatant.value = undefined;
    },
    [field, onChange]
  );

  const onClick = useCallback(() => {
    wantsCombatant.value =
      wantsCombatant.value !== setTarget ? setTarget : undefined;
  }, [setTarget]);

  return (
    <div>
      <div>Target: {value ? <CombatantRef who={value} /> : "NONE"}</div>
      <button
        className={classnames({
          [styles.active]: wantsCombatant.value === setTarget,
        })}
        onClick={onClick}
      >
        Choose Target
      </button>
    </div>
  );
}

function ChooseTargets({
  field,
  resolver,
  value,
  onChange,
}: ChooserProps<Combatant[], MultiTargetResolver>) {
  const addTarget = useCallback(
    (who?: Combatant) => {
      if (who && !(value ?? []).includes(who))
        onChange(field, (value ?? []).concat(who));
      wantsCombatant.value = undefined;
    },
    [field, onChange, value]
  );

  const onClick = useCallback(() => {
    wantsCombatant.value =
      wantsCombatant.value !== addTarget ? addTarget : undefined;
  }, [addTarget]);

  const remove = useCallback(
    (who: Combatant) =>
      onChange(
        field,
        (value ?? []).filter((x) => x !== who)
      ),
    [field, onChange, value]
  );

  return (
    <div>
      <div>
        Targets ({describeRange(resolver.minimum, resolver.maximum)}
        ):
        {(value ?? []).length ? (
          <ul>
            {(value ?? []).map((who) => (
              <li key={who.id}>
                <CombatantRef who={who} />{" "}
                <button onClick={() => remove(who)}>remove {who.name}</button>
              </li>
            ))}
          </ul>
        ) : (
          ` NONE`
        )}
      </div>
      <button
        className={classnames({
          [styles.active]: wantsCombatant.value === addTarget,
        })}
        disabled={(value?.length ?? 0) >= resolver.maximum}
        onClick={onClick}
      >
        Add Target
      </button>
    </div>
  );
}

function ChoosePoint({ field, value, onChange }: ChooserProps<Point>) {
  const setTarget = useCallback(
    (p?: Point) => {
      onChange(field, p);
      wantsPoint.value = undefined;
    },
    [field, onChange]
  );

  const onClick = useCallback(() => {
    wantsPoint.value = wantsPoint.value !== setTarget ? setTarget : undefined;
  }, [setTarget]);

  return (
    <div>
      <div>Point: {describePoint(value)}</div>
      <button
        className={classnames({
          [styles.active]: wantsPoint.value === setTarget,
        })}
        onClick={onClick}
      >
        Choose Point
      </button>
    </div>
  );
}

function ChoosePoints({
  field,
  resolver,
  value,
  onChange,
}: ChooserProps<Point[], MultiPointResolver>) {
  const addPoint = useCallback(
    (p?: Point) => {
      if (p) onChange(field, (value ?? []).concat(p));
      wantsPoint.value = undefined;
    },
    [field, onChange, value]
  );

  const onClick = useCallback(() => {
    wantsPoint.value = wantsPoint.value !== addPoint ? addPoint : undefined;
  }, [addPoint]);

  const remove = useCallback(
    (p: Point) =>
      onChange(
        field,
        (value ?? []).filter((x) => x !== p)
      ),
    [field, onChange, value]
  );

  return (
    <div>
      <div>
        Points ({describeRange(resolver.minimum, resolver.maximum)}
        ):
        {(value ?? []).length ? (
          <ul>
            {(value ?? []).map((p, i) => (
              <li key={i}>
                {describePoint(p)}
                <button onClick={() => remove(p)}>
                  remove {describePoint(p)}
                </button>
              </li>
            ))}
          </ul>
        ) : (
          ` NONE`
        )}
      </div>
      <button
        className={classnames({
          [styles.active]: wantsPoint.value === addPoint,
        })}
        onClick={onClick}
      >
        Add Point
      </button>
    </div>
  );
}

function ChooseSlot({
  action,
  field,
  resolver,
  value,
  onChange,
}: ChooserProps<number, SlotResolver>) {
  return (
    <div>
      <div>Spell Slot: {value ?? "NONE"}</div>
      <div>
        {enumerate(
          resolver.getMinimum(action.actor),
          resolver.getMaximum(action.actor)
        ).map((slot) => (
          <button
            key={slot}
            className={classnames({ [styles.active]: value === slot })}
            aria-pressed={value === slot}
            onClick={() => onChange(field, slot)}
          >
            {slot}
          </button>
        ))}
      </div>
    </div>
  );
}

function ChooseText<T>({
  field,
  resolver,
  value,
  onChange,
}: ChooserProps<T, ChoiceResolver<T>>) {
  return (
    <div>
      <div>Choice: {value ?? "NONE"}</div>
      <div>
        {resolver.entries.map((e) => (
          <button
            key={e.label}
            className={classnames({ [styles.active]: value === e.value })}
            aria-pressed={value === e.value}
            onClick={() => onChange(field, e.value)}
            disabled={e.disabled}
          >
            {e.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function getInitialConfig<T extends object>(
  action: Action<T>,
  initial?: Partial<T>
): Partial<T> {
  const config: Partial<T> = { ...initial };

  for (const [key, resolver] of Object.entries(action.getConfig(config))) {
    if (resolver instanceof SlotResolver && !config[key as keyof T])
      (config[key as keyof T] as number) = resolver.getMinimum(action.actor);
  }

  return config;
}

interface Props<T extends object> {
  action: Action<T>;
  initialConfig?: Partial<T>;
  onCancel(): void;
  onExecute(action: Action<T>, config: T): void;
}
export default function ChooseActionConfigPanel<T extends object>({
  action,
  initialConfig = {},
  onCancel,
  onExecute,
}: Props<T>) {
  const [config, setConfig] = useState(getInitialConfig(action, initialConfig));
  const patchConfig = useCallback(
    (key: string, value: unknown) => {
      setConfig((old) => {
        const newConfig = { ...old, [key]: value };
        actionAreas.value = action.getAffectedArea(newConfig);
        return newConfig;
      });
    },
    [action]
  );

  const errors = useMemo(
    () => check(action, config).messages,
    [action, config]
  );
  const disabled = useMemo(() => errors.length > 0, [errors]);
  const damage = useMemo(() => action.getDamage(config), [action, config]);

  const execute = useCallback(() => {
    if (checkConfig(action, config)) onExecute(action, config);
  }, [action, config, onExecute]);

  const elements = useMemo(
    () =>
      Object.entries(action.getConfig(config)).map(([key, resolver]) => {
        const props = {
          key,
          action,
          field: key,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          resolver: resolver as any,
          onChange: patchConfig,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          value: config[key as keyof T] as any,
        };

        if (resolver instanceof TargetResolver)
          return <ChooseTarget {...props} />;
        else if (resolver instanceof MultiTargetResolver)
          return <ChooseTargets {...props} />;
        else if (resolver instanceof PointResolver)
          return <ChoosePoint {...props} />;
        else if (resolver instanceof MultiPointResolver)
          return <ChoosePoints {...props} />;
        else if (resolver instanceof SlotResolver)
          return <ChooseSlot {...props} />;
        else if (resolver instanceof ChoiceResolver)
          return <ChooseText {...props} />;
        else
          return (
            <div>
              (no frontend for resolver type [{props.resolver.type}] yet)
            </div>
          );
      }),
    [action, config, patchConfig]
  );

  const statusWarning =
    action.status === "incomplete" ? (
      <div className={styles.warning}>Incomplete implementation</div>
    ) : action.status === "missing" ? (
      <div className={styles.warning}>Not implemented</div>
    ) : null;

  return (
    <aside className={styles.main} aria-label="Action Options">
      <div>{action.name}</div>
      {statusWarning}
      {damage && (
        <div>
          Damage:{" "}
          <div className={common.damageList}>
            {damage.map((dmg, i) => (
              <span key={i}>
                {dmg.type === "flat"
                  ? dmg.amount
                  : `${dmg.amount.count}d${dmg.amount.size}`}{" "}
                {dmg.damageType}
              </span>
            ))}{" "}
            (
            {Math.ceil(
              damage.reduce(
                (total, dmg) =>
                  total +
                  (dmg.type === "flat"
                    ? dmg.amount
                    : getDiceAverage(dmg.amount.count, dmg.amount.size)),
                0
              )
            )}
            )
          </div>
        </div>
      )}
      <button disabled={disabled} onClick={execute}>
        Execute
      </button>
      <button onClick={onCancel}>Cancel</button>
      <div>{elements}</div>
      {errors.length > 0 && (
        <Labelled label="Errors">
          {errors.map((msg, i) => (
            <div key={i}>{msg}</div>
          ))}
        </Labelled>
      )}
    </aside>
  );
}
