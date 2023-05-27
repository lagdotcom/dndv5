import { useCallback, useMemo, useState } from "preact/hooks";

import MultiTargetResolver from "../resolvers/MultiTargetResolver";
import PointResolver from "../resolvers/PointResolver";
import SlotResolver from "../resolvers/SlotResolver";
import TargetResolver from "../resolvers/TargetResolver";
import Action, { Resolver } from "../types/Action";
import Combatant from "../types/Combatant";
import Point from "../types/Point";
import { check, checkConfig } from "../utils/config";
import { getDiceAverage } from "../utils/dnd";
import { enumerate } from "../utils/numbers";
import styles from "./ChooseActionConfigPanel.module.scss";
import CombatantRef from "./CombatantRef";
import Labelled from "./Labelled";
import { actionArea, wantsCombatant, wantsPoint } from "./utils/state";

type ChooserProps<T, R = Resolver<T>> = {
  action: Action;
  field: string;
  onChange(key: string, value?: T): void;
  resolver: R;
  value?: T;
};

function ChooseTarget({ field, value, onChange }: ChooserProps<Combatant>) {
  const onClick = useCallback(() => {
    wantsCombatant.value = (who) => {
      wantsCombatant.value = undefined;
      onChange(field, who);
    };
  }, [field, onChange]);

  return (
    <div>
      <div>Target: {value ? <CombatantRef who={value} /> : "NONE"}</div>
      <button onClick={onClick}>Choose Target</button>
    </div>
  );
}

function ChooseTargets({
  field,
  resolver,
  value,
  onChange,
}: ChooserProps<Combatant[], MultiTargetResolver>) {
  const onClick = useCallback(() => {
    wantsCombatant.value = (who) => {
      wantsCombatant.value = undefined;
      if (who) onChange(field, (value ?? []).concat(who));
    };
  }, [field, onChange, value]);

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
        Targets (
        {resolver.minimum === resolver.maximum
          ? `exactly ${resolver.minimum}`
          : `${resolver.minimum} - ${resolver.maximum}`}
        ):
        {(value ?? []).length ? (
          <ul>
            {(value ?? []).map((who, i) => (
              <li key={i}>
                <CombatantRef who={who} />{" "}
                <button onClick={() => remove(who)}>remove {who.name}</button>
              </li>
            ))}
          </ul>
        ) : (
          ` NONE`
        )}
      </div>
      <button onClick={onClick}>Add Target</button>
    </div>
  );
}

function ChoosePoint({ field, value, onChange }: ChooserProps<Point>) {
  const onClick = useCallback(() => {
    wantsPoint.value = (point) => {
      wantsPoint.value = undefined;
      onChange(field, point);
    };
  }, [field, onChange]);

  return (
    <div>
      <div>Point: {value ? `${value.x},${value.y}` : "NONE"}</div>
      <button onClick={onClick}>Choose Point</button>
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
            className={value === slot ? styles.active : undefined}
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

function getInitialConfig<T extends object>(
  action: Action<T>,
  initial?: Partial<T>
): Partial<T> {
  const config: Partial<T> = { ...initial };

  for (const [key, resolver] of Object.entries(action.config)) {
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
        actionArea.value = action.getAffectedArea(newConfig);
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
      Object.entries(action.config).map(([key, resolver]) => {
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
        else if (resolver instanceof SlotResolver)
          return <ChooseSlot {...props} />;
        else
          return (
            <div>
              (no frontend for resolver type [{props.resolver.type}] yet)
            </div>
          );
      }),
    [action, config, patchConfig]
  );

  return (
    <aside className={styles.main} aria-label="Action Options">
      <div>{action.name}</div>
      {damage && (
        <div>
          Damage:{" "}
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
