import { useCallback, useMemo, useState } from "preact/hooks";

import PointResolver from "../resolvers/PointResolver";
import SlotResolver from "../resolvers/SlotResolver";
import TargetResolver from "../resolvers/TargetResolver";
import Action, { Resolver } from "../types/Action";
import Combatant from "../types/Combatant";
import Point from "../types/Point";
import { checkConfig } from "../utils/config";
import { enumerate } from "../utils/numbers";
import styles from "./ChooseActionConfigPanel.module.scss";
import { wantsCombatant, wantsPoint } from "./state";

type ChooserProps<T, R = Resolver<T>> = {
  action: Action;
  field: string;
  onChange(key: string, value?: T): void;
  resolver: R;
  value?: T;
};

function ChooseTarget({
  action,
  field,
  resolver,
  value,
  onChange,
}: ChooserProps<Combatant>) {
  const errors = useMemo(
    () => resolver.check(value, action).messages,
    [action, resolver, value]
  );

  const onClick = useCallback(() => {
    wantsCombatant.value = (who) => {
      wantsCombatant.value = undefined;
      onChange(field, who);
    };
  }, [field, onChange]);

  return (
    <div>
      <div>Target: {value?.name ?? "NONE"}</div>
      <button onClick={onClick}>Choose Target</button>
      {value && errors.length > 0 && <div>{errors}</div>}
    </div>
  );
}

function ChoosePoint({
  action,
  field,
  resolver,
  value,
  onChange,
}: ChooserProps<Point>) {
  const errors = useMemo(
    () => resolver.check(value, action).messages,
    [action, resolver, value]
  );

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
      {value && errors.length > 0 && <div>{errors}</div>}
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
  const errors = useMemo(
    () => resolver.check(value, action).messages,
    [action, resolver, value]
  );

  return (
    <div>
      <div>Spell Slot: {value ?? "NONE"}</div>
      <div>
        {enumerate(resolver.minimum, resolver.maximum).map((slot) => (
          <button
            key={slot}
            className={value === slot ? styles.active : undefined}
            onClick={() => onChange(field, slot)}
          >
            {slot}
          </button>
        ))}
      </div>
      {value && errors.length > 0 && <div>{errors}</div>}
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
      (config[key as keyof T] as number) = resolver.minimum;
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
  const patchConfig = useCallback((key: string, value: unknown) => {
    setConfig((old) => ({ ...old, [key]: value }));
  }, []);

  const disabled = useMemo(
    () => !checkConfig(action, config),
    [action, config]
  );

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
      <button disabled={disabled} onClick={execute}>
        Execute
      </button>
      <button onClick={onCancel}>Cancel</button>
      <div>{elements}</div>
    </aside>
  );
}
