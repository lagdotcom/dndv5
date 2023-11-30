import { useCallback, useEffect, useMemo, useState } from "preact/hooks";

import Engine from "../../Engine";
import { PickChoice } from "../../interruptions/PickFromListChoice";
import AllocationResolver, {
  Allocation,
} from "../../resolvers/AllocationResolver";
import ChoiceResolver from "../../resolvers/ChoiceResolver";
import MultiChoiceResolver from "../../resolvers/MultiChoiceResolver";
import MultiPointResolver from "../../resolvers/MultiPointResolver";
import MultiTargetResolver from "../../resolvers/MultiTargetResolver";
import NumberRangeResolver from "../../resolvers/NumberRangeResolver";
import PointResolver from "../../resolvers/PointResolver";
import PointToPointResolver from "../../resolvers/PointToPointResolver";
import SlotResolver from "../../resolvers/SlotResolver";
import TargetResolver from "../../resolvers/TargetResolver";
import Action from "../../types/Action";
import Amount from "../../types/Amount";
import Combatant from "../../types/Combatant";
import DamageType from "../../types/DamageType";
import Point from "../../types/Point";
import Resolver from "../../types/Resolver";
import { checkConfig, getConfigErrors } from "../../utils/config";
import { getDiceAverage } from "../../utils/dnd";
import { enumerate } from "../../utils/numbers";
import { describePoint, describeRange } from "../../utils/text";
import classnames from "../utils/classnames";
import {
  actionAreas,
  activeCombatant,
  wantsCombatant,
  wantsPoint,
} from "../utils/state";
import buttonStyles from "./button.module.scss";
import styles from "./ChooseActionConfigPanel.module.scss";
import CombatantRef from "./CombatantRef";
import commonStyles from "./common.module.scss";
import Labelled from "./Labelled";
import RangeInput from "./RangeInput";

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
    [field, onChange],
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
          [buttonStyles.active]: wantsCombatant.value === setTarget,
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
    [field, onChange, value],
  );

  const onClick = useCallback(() => {
    wantsCombatant.value =
      wantsCombatant.value !== addTarget ? addTarget : undefined;
  }, [addTarget]);

  const remove = useCallback(
    (who: Combatant) =>
      onChange(
        field,
        (value ?? []).filter((x) => x !== who),
      ),
    [field, onChange, value],
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
          [buttonStyles.active]: wantsCombatant.value === addTarget,
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
    [field, onChange],
  );

  const onClick = useCallback(() => {
    wantsPoint.value = wantsPoint.value !== setTarget ? setTarget : undefined;
  }, [setTarget]);

  return (
    <div>
      <div>Point: {describePoint(value)}</div>
      <button
        className={classnames({
          [buttonStyles.active]: wantsPoint.value === setTarget,
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
    [field, onChange, value],
  );

  const onClick = useCallback(() => {
    wantsPoint.value = wantsPoint.value !== addPoint ? addPoint : undefined;
  }, [addPoint]);

  const remove = useCallback(
    (p: Point) =>
      onChange(
        field,
        (value ?? []).filter((x) => x !== p),
      ),
    [field, onChange, value],
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
          [buttonStyles.active]: wantsPoint.value === addPoint,
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
          resolver.getMaximum(action.actor),
        ).map((slot) => (
          <button
            key={slot}
            className={classnames({ [buttonStyles.active]: value === slot })}
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
  const [label, setLabel] = useState("NONE");

  const choose = (e: PickChoice<T>) => () => {
    if (e.value === value) {
      onChange(field, undefined);
      setLabel("NONE");
      return;
    }

    onChange(field, e.value);
    setLabel(e.label);
  };

  return (
    <div>
      <div>Choice: {label}</div>
      <div>
        {resolver.entries.map((e) => (
          <button
            key={e.label}
            className={classnames({ [buttonStyles.active]: value === e.value })}
            aria-pressed={value === e.value}
            onClick={choose(e)}
            disabled={e.disabled}
          >
            {e.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function ChooseMany<T>({
  field,
  resolver,
  value,
  onChange,
}: ChooserProps<T[], MultiChoiceResolver<T>>) {
  const [labels, setLabels] = useState<string[]>([]);

  const add = useCallback(
    (ch: PickChoice<T>) => {
      if (!(value ?? []).find((x) => x === ch)) {
        onChange(field, (value ?? []).concat(ch.value));
        setLabels((old) => old.concat(ch.label));
      }
    },
    [field, onChange, value],
  );

  const remove = useCallback(
    (ch: PickChoice<T>) => {
      onChange(
        field,
        (value ?? []).filter((x) => x !== ch.value),
      );
      setLabels((old) => old.filter((x) => x !== ch.label));
    },
    [field, onChange, value],
  );

  return (
    <div>
      <div>Choice: {labels.length ? labels.join(", ") : "NONE"}</div>
      <div>
        {resolver.entries.map((e) => {
          const selected = (value ?? []).includes(e.value);
          const full = (value ?? []).length > resolver.maximum;
          return (
            <button
              key={e.label}
              className={classnames({ [buttonStyles.active]: selected })}
              aria-pressed={selected}
              onClick={selected ? () => remove(e) : () => add(e)}
              disabled={e.disabled || full}
            >
              {e.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ChooseNumber({
  field,
  resolver,
  value,
  onChange,
}: ChooserProps<number, NumberRangeResolver>) {
  return (
    <div>
      <div>
        {resolver.rangeName} Choice: {value ?? "NONE"}
      </div>
      <RangeInput
        min={resolver.min}
        max={resolver.max}
        value={value ?? 0}
        onChange={(v) => onChange(field, v)}
      />
    </div>
  );
}

function ChooseAllocations({
  field,
  resolver,
  value,
  onChange,
}: ChooserProps<Allocation[], AllocationResolver>) {
  const addTarget = useCallback(
    (who?: Combatant) => {
      if (who && !(value ?? []).find((e) => e.who === who))
        onChange(field, (value ?? []).concat({ amount: 1, who }));
      wantsCombatant.value = undefined;
    },
    [field, onChange, value],
  );

  const onClick = useCallback(() => {
    wantsCombatant.value =
      wantsCombatant.value !== addTarget ? addTarget : undefined;
  }, [addTarget]);

  const remove = useCallback(
    (who: Combatant) =>
      onChange(
        field,
        (value ?? []).filter((x) => x.who !== who),
      ),
    [field, onChange, value],
  );

  return (
    <div>
      <div>
        {resolver.rangeName} (
        {describeRange(resolver.minimum, resolver.maximum)}):
        {(value ?? []).length ? (
          <ul>
            {(value ?? []).map(({ amount, who }) => (
              <li key={who.id}>
                <CombatantRef who={who} />{" "}
                <button onClick={() => remove(who)}>remove {who.name}</button>
                <RangeInput
                  min={0}
                  max={resolver.maximum}
                  value={amount}
                  onChange={(amount) =>
                    onChange(
                      field,
                      (value ?? []).map((x) =>
                        x.who === who ? { amount, who } : x,
                      ),
                    )
                  }
                />
              </li>
            ))}
          </ul>
        ) : (
          "NONE"
        )}
      </div>
      <button
        className={classnames({
          [buttonStyles.active]: wantsCombatant.value === addTarget,
        })}
        onClick={onClick}
      >
        Add Target
      </button>
    </div>
  );
}

function getInitialConfig<T extends object>(
  action: Action<T>,
  initial?: Partial<T>,
): Partial<T> {
  const config: Partial<T> = { ...initial };

  for (const [key, resolver] of Object.entries(action.getConfig(config))) {
    if (resolver instanceof SlotResolver && !config[key as keyof T])
      (config[key as keyof T] as number) = resolver.getMinimum(action.actor);
    else if (resolver instanceof NumberRangeResolver && !config[key as keyof T])
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
  initialConfig?: Partial<T>;
  onCancel(): void;
  onExecute(action: Action<T>, config: T): void;
}
export default function ChooseActionConfigPanel<T extends object>({
  g,
  action,
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

  useEffect(() => {
    actionAreas.value = action.getAffectedArea(config);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [action, activeCombatant.value, config]);

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

  const elements = useMemo(
    () =>
      Object.entries(action.getConfig(config)).map(([key, resolver]) => {
        const subProps = {
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
          return <ChooseTarget {...subProps} />;
        else if (resolver instanceof MultiTargetResolver)
          return <ChooseTargets {...subProps} />;
        else if (
          resolver instanceof PointResolver ||
          resolver instanceof PointToPointResolver
        )
          return <ChoosePoint {...subProps} />;
        else if (resolver instanceof MultiPointResolver)
          return <ChoosePoints {...subProps} />;
        else if (resolver instanceof SlotResolver)
          return <ChooseSlot {...subProps} />;
        else if (resolver instanceof ChoiceResolver)
          return <ChooseText {...subProps} />;
        else if (resolver instanceof MultiChoiceResolver)
          return <ChooseMany {...subProps} />;
        else if (resolver instanceof NumberRangeResolver)
          return <ChooseNumber {...subProps} />;
        else if (resolver instanceof AllocationResolver)
          return <ChooseAllocations {...subProps} />;
        else
          return (
            <div>
              (no frontend for resolver type [{subProps.resolver.type}] yet)
            </div>
          );
      }),
    [action, config, patchConfig],
  );

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
          {action.isAttack ? "attack" : time ?? "no cost"}
        </div>
      </div>
      {statusWarning}
      {description && (
        <div className={styles.description}>
          {description.split("\n").map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      )}
      {damage && (
        <div>
          Damage:{" "}
          <div className={commonStyles.damageList}>
            {damage.map((a, i) => (
              <AmountElement key={i} a={a} type={a.damageType} />
            ))}{" "}
            ({Math.ceil(damage.reduce(amountReducer, 0))})
          </div>
        </div>
      )}
      {heal && (
        <div>
          Heal:{" "}
          <div className={commonStyles.healList}>
            {heal.map((a, i) => (
              <AmountElement key={i} a={a} />
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
          <div>{elements}</div>
          {errors.length > 0 && (
            <Labelled label="Errors">
              {errors.map((msg, i) => (
                <div key={i}>{msg}</div>
              ))}
            </Labelled>
          )}
        </>
      )}
    </aside>
  );
}
