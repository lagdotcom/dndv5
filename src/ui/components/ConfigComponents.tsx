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
import { ActionConfig, GetActionConfig } from "../../types/Action";
import Combatant from "../../types/Combatant";
import Point from "../../types/Point";
import Resolver from "../../types/Resolver";
import { PatcherAccepter } from "../../utils/immutable";
import { enumerate } from "../../utils/numbers";
import { objectEntries } from "../../utils/objects";
import { describePoint, describeRange } from "../../utils/text";
import { useCallback, useMemo, useState } from "../lib";
import classnames from "../utils/classnames";
import { wantsCombatant, wantsPoint } from "../utils/state";
import buttonStyles from "./button.module.scss";
import CombatantRef from "./CombatantRef";
import RangeInput from "./RangeInput";

interface ChooserProps<T, R = Resolver<T>> {
  onChange(value?: T): void;
  resolver: R;
  value?: T;
}

function ChooseTarget({ value, onChange }: ChooserProps<Combatant>) {
  const setTarget = useCallback(
    (who?: Combatant) => {
      onChange(who);
      wantsCombatant.value = undefined;
    },
    [onChange],
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
  resolver,
  value,
  onChange,
}: ChooserProps<Combatant[], MultiTargetResolver>) {
  const addTarget = useCallback(
    (who?: Combatant) => {
      if (who && !(value ?? []).includes(who))
        onChange((value ?? []).concat(who));
      wantsCombatant.value = undefined;
    },
    [onChange, value],
  );

  const onClick = useCallback(() => {
    wantsCombatant.value =
      wantsCombatant.value !== addTarget ? addTarget : undefined;
  }, [addTarget]);

  const remove = useCallback(
    (who: Combatant) => onChange((value ?? []).filter((x) => x !== who)),
    [onChange, value],
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

function ChoosePoint({ value, onChange }: ChooserProps<Point>) {
  const setTarget = useCallback(
    (p?: Point) => {
      onChange(p);
      wantsPoint.value = undefined;
    },
    [onChange],
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
  resolver,
  value,
  onChange,
}: ChooserProps<Point[], MultiPointResolver>) {
  const addPoint = useCallback(
    (p?: Point) => {
      if (p) onChange((value ?? []).concat(p));
      wantsPoint.value = undefined;
    },
    [onChange, value],
  );

  const onClick = useCallback(() => {
    wantsPoint.value = wantsPoint.value !== addPoint ? addPoint : undefined;
  }, [addPoint]);

  const remove = useCallback(
    (p: Point) => onChange((value ?? []).filter((x) => x !== p)),
    [onChange, value],
  );

  return (
    <div>
      <div>
        Points ({describeRange(resolver.minimum, resolver.maximum)}
        ):
        {(value ?? []).length ? (
          <ul>
            {(value ?? []).map((p, key) => (
              <li key={key}>
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
  resolver,
  value,
  onChange,
}: ChooserProps<number, SlotResolver>) {
  return (
    <div>
      <div>Spell Slot: {value ?? "NONE"}</div>
      <div>
        {enumerate(resolver.min, resolver.max).map((slot) => (
          <button
            key={slot}
            className={classnames({ [buttonStyles.active]: value === slot })}
            aria-pressed={value === slot}
            onClick={() => onChange(slot)}
          >
            {slot}
          </button>
        ))}
      </div>
    </div>
  );
}

function ChooseText<T>({
  resolver,
  value,
  onChange,
}: ChooserProps<T, ChoiceResolver<T>>) {
  const [label, setLabel] = useState(
    resolver.entries.find((e) => e.value === value)?.label ?? "NONE",
  );

  const choose = (e: PickChoice<T>) => () => {
    if (e.value === value) {
      onChange(undefined);
      setLabel("NONE");
      return;
    }

    onChange(e.value);
    setLabel(e.label);
  };

  return (
    <div>
      <div>
        {resolver.name}: {label}
      </div>
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
  resolver,
  value,
  onChange,
}: ChooserProps<T[], MultiChoiceResolver<T>>) {
  const [labels, setLabels] = useState<string[]>([]);

  const add = useCallback(
    (ch: PickChoice<T>) => {
      if (!(value ?? []).find((x) => x === ch)) {
        onChange((value ?? []).concat(ch.value));
        setLabels((old) => old.concat(ch.label));
      }
    },
    [onChange, value],
  );

  const remove = useCallback(
    (ch: PickChoice<T>) => {
      onChange((value ?? []).filter((x) => x !== ch.value));
      setLabels((old) => old.filter((x) => x !== ch.label));
    },
    [onChange, value],
  );

  return (
    <div>
      <div>
        {resolver.name}: {labels.length ? labels.join(", ") : "NONE"}
      </div>
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
        onChange={onChange}
      />
    </div>
  );
}

function ChooseAllocations({
  resolver,
  value,
  onChange,
}: ChooserProps<Allocation[], AllocationResolver>) {
  const addTarget = useCallback(
    (who?: Combatant) => {
      if (who && !(value ?? []).find((e) => e.who === who))
        onChange((value ?? []).concat({ amount: 1, who }));
      wantsCombatant.value = undefined;
    },
    [onChange, value],
  );

  const onClick = useCallback(() => {
    wantsCombatant.value =
      wantsCombatant.value !== addTarget ? addTarget : undefined;
  }, [addTarget]);

  const remove = useCallback(
    (who: Combatant) => onChange((value ?? []).filter((x) => x.who !== who)),
    [onChange, value],
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

export interface ConfigComponentsProps<T extends object> {
  config: Partial<T>;
  getConfig: GetActionConfig<T>;
  patchConfig: PatcherAccepter<Partial<T>>;
}

export default function ConfigComponents<T extends object>({
  config,
  getConfig,
  patchConfig,
}: ConfigComponentsProps<T>) {
  const elements = useMemo(
    () =>
      objectEntries<ActionConfig<T>>(getConfig(config)).map(
        ([key, resolver]) => {
          const subProps = {
            key,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            resolver: resolver as any,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            onChange: (value: any) => patchConfig((old) => (old[key] = value)),
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            value: config[key] as any,
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
        },
      ),
    [config, getConfig, patchConfig],
  );

  return <div>{elements}</div>;
}
