import { ComponentChildren, VNode } from "preact";
import { useCallback, useEffect, useRef, useState } from "preact/hooks";

import Engine from "../Engine";
import { AbilityCheckDetail } from "../events/AbilityCheckEvent";
import { AttackDetail } from "../events/AttackEvent";
import { CombatantDamagedDetail } from "../events/CombatantDamagedEvent";
import { CombatantDiedDetail } from "../events/CombatantDiedEvent";
import { CombatantHealedDetail } from "../events/CombatantHealedEvent";
import { DiceRolledDetail } from "../events/DiceRolledEvent";
import { EffectAddedDetail } from "../events/EffectAddedEvent";
import { EffectRemovedDetail } from "../events/EffectRemovedEvent";
import { ExhaustionDetail } from "../events/ExhaustionEvent";
import { SaveEventDetail } from "../events/SaveEvent";
import { SpellCastDetail } from "../events/SpellCastEvent";
import DamageBreakdown from "../types/DamageBreakdown";
import DamageType from "../types/DamageType";
import { InitiativeRoll } from "../types/RollType";
import { describeAbility } from "../utils/text";
import CombatantRef from "./CombatantRef";
import common from "./common.module.scss";
import styles from "./EventLog.module.scss";
import useTimeout from "./hooks/useTimeout";

function LogMessage({
  children,
  message,
}: {
  children: ComponentChildren;
  message: string;
}) {
  return (
    <li aria-label={message} className={styles.messageWrapper}>
      <div aria-hidden="true" className={styles.message}>
        {children}
      </div>
    </li>
  );
}

function AttackMessage({
  pre: { who, target, weapon, ammo, spell },
  roll,
  total,
  ac,
}: AttackDetail) {
  return (
    <LogMessage
      message={`${who.name} attacks ${target.name}${
        roll.diceType !== "normal" ? ` at ${roll.diceType}` : ""
      }${weapon ? ` with ${weapon.name}` : ""}${
        spell ? ` with ${spell.name}` : ""
      }${ammo ? `, firing ${ammo.name}` : ""} (${total}). (AC ${ac})`}
    >
      <CombatantRef who={who} />
      attacks&nbsp;
      <CombatantRef who={target} />
      {roll.diceType !== "normal" && ` at ${roll.diceType}`}
      {weapon && ` with ${weapon.name}`}
      {spell && ` with ${spell.name}`}
      {ammo && `, firing ${ammo.name}`}
      &nbsp;({total}). (AC {ac})
    </LogMessage>
  );
}

function CastMessage({ level, spell, who }: SpellCastDetail) {
  // TODO should probably not show you all this info...
  return (
    <LogMessage
      message={`${who.name} casts ${spell.name}${
        level !== spell.level ? ` at level ${level}` : ""
      }.`}
    >
      <CombatantRef who={who} />
      casts {spell.name}
      {level !== spell.level && ` at level ${level}`}.
    </LogMessage>
  );
}

function getDamageEntryText([type, entry]: [
  type: DamageType,
  entry: DamageBreakdown,
]) {
  return `${entry.amount} ${type}${
    entry.response !== "normal" ? ` ${entry.response}` : ""
  }`;
}

function DamageMessage({ who, total, breakdown }: CombatantDamagedDetail) {
  return (
    <LogMessage
      message={`${who.name} takes ${total} damage. (${Array.from(breakdown)
        .map(getDamageEntryText)
        .join(", ")})`}
    >
      <CombatantRef who={who} />
      takes {total} damage. (
      <div className={common.damageList}>
        {Array.from(breakdown).map(([type, entry]) => (
          <span key={type}>{getDamageEntryText([type, entry])}</span>
        ))}
      </div>
      )
    </LogMessage>
  );
}

function DeathMessage({ who }: CombatantDiedDetail) {
  return (
    <LogMessage message={`${who.name} dies!`}>
      <CombatantRef who={who} />
      dies!
    </LogMessage>
  );
}

function EffectAddedMessage({ who, effect }: EffectAddedDetail) {
  return (
    <LogMessage message={`${who.name} gains effect: ${effect.name}`}>
      <CombatantRef who={who} /> gains effect: {effect.name}.
    </LogMessage>
  );
}

function EffectRemovedMessage({ who, effect }: EffectRemovedDetail) {
  return (
    <LogMessage message={`${who.name} loses effect: ${effect.name}`}>
      <CombatantRef who={who} /> loses effect: {effect.name}.
    </LogMessage>
  );
}

function AbilityCheckMessage({ roll, total, dc }: AbilityCheckDetail) {
  return (
    <LogMessage
      message={`${roll.type.who.name} rolls a ${total} on a ${describeAbility(
        roll.type.ability,
      )} (${roll.type.skill}) ability check. (DC ${dc})`}
    >
      <CombatantRef who={roll.type.who} /> rolls a {total} on a{" "}
      {describeAbility(roll.type.ability)} ({roll.type.skill}) ability check.
      (DC {dc})
    </LogMessage>
  );
}

function InitiativeMessage({
  diceType,
  type,
  value,
}: DiceRolledDetail<InitiativeRoll>) {
  return (
    <LogMessage
      message={`${type.who.name} rolls a ${value} for initiative${
        diceType !== "normal" ? ` at ${diceType}` : ""
      }.`}
    >
      <CombatantRef who={type.who} /> rolls a {value} for initiative
      {diceType !== "normal" && ` at ${diceType}`}.
    </LogMessage>
  );
}

function SaveMessage({ roll, total, dc }: SaveEventDetail) {
  return (
    <LogMessage
      message={`${roll.type.who.name} rolls a ${total} on a ${describeAbility(
        roll.type.ability,
      )} saving throw. (DC ${dc})`}
    >
      <CombatantRef who={roll.type.who} /> rolls a {total} on a{" "}
      {describeAbility(roll.type.ability)} saving throw. (DC {dc})
    </LogMessage>
  );
}

function HealedMessage({ who, amount, fullAmount }: CombatantHealedDetail) {
  const over = fullAmount - amount;
  const wasted = over > 0 ? ` (${over} wasted)` : undefined;

  return (
    <LogMessage message={`${who.name} heals for ${amount}${wasted}.`}>
      <CombatantRef who={who} /> heals for {amount}
      {wasted}.
    </LogMessage>
  );
}

function ExhaustionMessage({ who, value }: ExhaustionDetail) {
  const amount = value ? `${value}` : "no";

  return (
    <LogMessage message={`${who.name} now has ${amount} exhaustion.`}>
      <CombatantRef who={who} /> now has {amount} exhaustion.
    </LogMessage>
  );
}

export default function EventLog({ g }: { g: Engine }) {
  const ref = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<VNode[]>([]);

  const { fire } = useTimeout(
    () => ref.current?.scrollIntoView?.({ behavior: "smooth" }),
  );

  const addMessage = useCallback((el: VNode) => {
    setMessages((old) => old.concat(el).slice(-50));
    fire();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    g.events.on("Attack", ({ detail }) =>
      addMessage(<AttackMessage {...detail} />),
    );
    g.events.on("CombatantDamaged", ({ detail }) =>
      addMessage(<DamageMessage {...detail} />),
    );
    g.events.on("CombatantHealed", ({ detail }) =>
      addMessage(<HealedMessage {...detail} />),
    );
    g.events.on("CombatantDied", ({ detail }) =>
      addMessage(<DeathMessage {...detail} />),
    );
    g.events.on("EffectAdded", ({ detail }) => {
      if (!detail.effect.quiet) addMessage(<EffectAddedMessage {...detail} />);
    });
    g.events.on("EffectRemoved", ({ detail }) => {
      if (!detail.effect.quiet)
        addMessage(<EffectRemovedMessage {...detail} />);
    });
    g.events.on("SpellCast", ({ detail }) =>
      addMessage(<CastMessage {...detail} />),
    );
    g.events.on("DiceRolled", ({ detail }) => {
      if (detail.type.type === "initiative")
        addMessage(
          <InitiativeMessage
            {...(detail as DiceRolledDetail<InitiativeRoll>)}
          />,
        );
    });
    g.events.on("AbilityCheck", ({ detail }) =>
      addMessage(<AbilityCheckMessage {...detail} />),
    );
    g.events.on("Save", ({ detail }) =>
      addMessage(<SaveMessage {...detail} />),
    );
    g.events.on("Exhaustion", ({ detail }) =>
      addMessage(<ExhaustionMessage {...detail} />),
    );
  }, [addMessage, g]);

  return (
    <div className={styles.container}>
      <ul className={styles.main} aria-label="Event Log">
        {messages}
      </ul>
      <div ref={ref} />
    </div>
  );
}
