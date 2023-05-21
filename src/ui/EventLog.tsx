import { VNode } from "preact";
import { useCallback, useEffect, useState } from "preact/hooks";

import Engine from "../Engine";
import EventData from "../events/EventData";
import Combatant from "../types/Combatant";
import styles from "./EventLog.module.scss";

function CombatantRef({ who }: { who: Combatant }) {
  return (
    <>
      <img className={styles.icon} src={who.img} alt={who.name} />
      <span className={styles.iconLabel} aria-hidden="true">
        {who.name}
      </span>
    </>
  );
}

function AttackMessage({
  pre: { attacker, target, weapon, ammo },
  total,
}: EventData["attack"]) {
  return (
    <li className={styles.message}>
      <CombatantRef who={attacker} />
      attacks&nbsp;
      <CombatantRef who={target} />
      {weapon && `with ${weapon.name}`}
      {ammo && `, firing ${ammo.name}`}
      &nbsp;({total}).
    </li>
  );
}

function DamageMessage({
  who,
  total,
  breakdown,
}: EventData["combatantDamaged"]) {
  return (
    <li className={styles.message}>
      <CombatantRef who={who} />
      takes {total} damage. (
      {[...breakdown].map(([type, entry]) => (
        <span key={type}>
          {entry.amount} {type}
          {entry.response !== "normal" ? ` ${entry.response}` : ""}
        </span>
      ))}
      )
    </li>
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
  }, [addMessage, g]);

  return <ul className={styles.main}>{messages}</ul>;
}
