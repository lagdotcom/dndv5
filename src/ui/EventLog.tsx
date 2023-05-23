import { ComponentChildren, VNode } from "preact";
import { useCallback, useEffect, useState } from "preact/hooks";

import Engine from "../Engine";
import EventData from "../events/EventData";
import DamageBreakdown from "../types/DamageBreakdown";
import DamageType from "../types/DamageType";
import CombatantRef from "./CombatantRef";
import styles from "./EventLog.module.scss";

function LogMessage({
  children,
  message,
}: {
  children: ComponentChildren;
  message: string;
}) {
  return (
    <li aria-label={message} className={styles.wrapper}>
      <div aria-hidden="true" className={styles.message}>
        {children}
      </div>
    </li>
  );
}

function AttackMessage({
  pre: { attacker, target, weapon, ammo },
  roll,
  total,
}: EventData["attack"]) {
  return (
    <LogMessage
      message={`${attacker.name} attacks ${target.name}${
        roll.diceType !== "normal" ? ` at ${roll.diceType}` : ""
      }${weapon ? ` with ${weapon.name}` : ""}${
        ammo ? `, firing ${ammo.name}` : ""
      } (${total}).`}
    >
      <CombatantRef who={attacker} />
      attacks&nbsp;
      <CombatantRef who={target} />
      {roll.diceType !== "normal" && ` at ${roll.diceType}`}
      {weapon && ` with ${weapon.name}`}
      {ammo && `, firing ${ammo.name}`}
      &nbsp;({total}).
    </LogMessage>
  );
}

function CastMessage({ level, spell, who }: EventData["spellCast"]) {
  // TODO should probably not show you all this info...
  return (
    <LogMessage message={`${who.name} casts ${spell.name} at level ${level}.`}>
      <CombatantRef who={who} />
      casts {spell.name} at level {level}.
    </LogMessage>
  );
}

function getDamageEntryText([type, entry]: [
  type: DamageType,
  entry: DamageBreakdown
]) {
  return `${entry.amount} ${type}${
    entry.response !== "normal" ? ` ${entry.response}` : ""
  }`;
}

function DamageMessage({
  who,
  total,
  breakdown,
}: EventData["combatantDamaged"]) {
  return (
    <LogMessage
      message={`${who.name} takes ${total} damage. (${[...breakdown].map(
        getDamageEntryText
      )})`}
    >
      <CombatantRef who={who} />
      takes {total} damage. (
      {[...breakdown].map(([type, entry]) => (
        <span key={type}>{getDamageEntryText([type, entry])}</span>
      ))}
      )
    </LogMessage>
  );
}

function DeathMessage({ who }: EventData["combatantDied"]) {
  return (
    <LogMessage message={`${who.name} dies!`}>
      <CombatantRef who={who} />
      dies!
    </LogMessage>
  );
}

export default function EventLog({ g }: { g: Engine }) {
  const [messages, setMessages] = useState<VNode[]>([]);

  const addMessage = useCallback(
    (el: VNode) => setMessages((old) => old.concat(el).slice(0, 50)),
    []
  );

  useEffect(() => {
    g.events.on("attack", ({ detail }) =>
      addMessage(<AttackMessage {...detail} />)
    );
    g.events.on("combatantDamaged", ({ detail }) =>
      addMessage(<DamageMessage {...detail} />)
    );
    g.events.on("combatantDied", ({ detail }) =>
      addMessage(<DeathMessage {...detail} />)
    );
    g.events.on("spellCast", ({ detail }) =>
      addMessage(<CastMessage {...detail} />)
    );
  }, [addMessage, g]);

  return (
    <ul className={styles.main} aria-label="Event Log">
      {messages}
    </ul>
  );
}
