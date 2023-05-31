import { ComponentChildren, VNode } from "preact";
import { useCallback, useEffect, useRef, useState } from "preact/hooks";

import Engine from "../Engine";
import EventData from "../events/EventData";
import Ability from "../types/Ability";
import DamageBreakdown from "../types/DamageBreakdown";
import DamageType from "../types/DamageType";
import { SavingThrow } from "../types/RollType";
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
}: EventData["attack"]) {
  return (
    <LogMessage
      message={`${who.name} attacks ${target.name}${
        roll.diceType !== "normal" ? ` at ${roll.diceType}` : ""
      }${weapon ? ` with ${weapon.name}` : ""}${
        spell ? ` with ${spell.name}` : ""
      }${ammo ? `, firing ${ammo.name}` : ""} (${total}).`}
    >
      <CombatantRef who={who} />
      attacks&nbsp;
      <CombatantRef who={target} />
      {roll.diceType !== "normal" && ` at ${roll.diceType}`}
      {weapon && ` with ${weapon.name}`}
      {spell && ` with ${spell.name}`}
      {ammo && `, firing ${ammo.name}`}
      &nbsp;({total}).
    </LogMessage>
  );
}

function CastMessage({ level, spell, who }: EventData["spellCast"]) {
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
      message={`${who.name} takes ${total} damage. (${[...breakdown]
        .map(getDamageEntryText)
        .join(", ")})`}
    >
      <CombatantRef who={who} />
      takes {total} damage. (
      <div className={common.damageList}>
        {[...breakdown].map(([type, entry]) => (
          <span key={type}>{getDamageEntryText([type, entry])}</span>
        ))}
      </div>
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

function EffectAddedMessage({ who, effect }: EventData["effectAdded"]) {
  return (
    <LogMessage message={`${who.name} gains effect: ${effect.name}`}>
      <CombatantRef who={who} /> gains effect: {effect.name}.
    </LogMessage>
  );
}

function EffectRemovedMessage({ who, effect }: EventData["effectRemoved"]) {
  return (
    <LogMessage message={`${who.name} loses effect: ${effect.name}`}>
      <CombatantRef who={who} /> loses effect: {effect.name}.
    </LogMessage>
  );
}

const niceAbilityName: Record<Ability, string> = {
  str: "Strength",
  dex: "Dexterity",
  con: "Constitution",
  int: "Intelligence",
  wis: "Wisdom",
  cha: "Charisma",
};

type Roll<T> = Omit<EventData["diceRolled"], "type"> & { type: T };

function SaveMessage({ type, value }: Roll<SavingThrow>) {
  return (
    <LogMessage
      message={`${type.who.name} rolls a ${value} on a ${
        niceAbilityName[type.ability]
      } saving throw.`}
    >
      <CombatantRef who={type.who} /> rolls a {value} on a{" "}
      {niceAbilityName[type.ability]} saving throw.
    </LogMessage>
  );
}

export default function EventLog({ g }: { g: Engine }) {
  const ref = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<VNode[]>([]);

  const { fire } = useTimeout(() =>
    ref.current?.scrollIntoView?.({ behavior: "smooth" })
  );

  const addMessage = useCallback((el: VNode) => {
    setMessages((old) => old.concat(el).slice(0, 50));
    fire();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    g.events.on("effectAdded", ({ detail }) => {
      if (!detail.effect.quiet) addMessage(<EffectAddedMessage {...detail} />);
    });
    g.events.on("effectRemoved", ({ detail }) => {
      if (!detail.effect.quiet)
        addMessage(<EffectRemovedMessage {...detail} />);
    });
    g.events.on("spellCast", ({ detail }) =>
      addMessage(<CastMessage {...detail} />)
    );
    g.events.on("diceRolled", ({ detail }) => {
      if (detail.type.type === "save")
        addMessage(<SaveMessage {...(detail as Roll<SavingThrow>)} />);
    });
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
