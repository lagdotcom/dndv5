import { VNode } from "preact";
import { useCallback, useEffect, useRef, useState } from "preact/hooks";

import Engine from "../Engine";
import { DiceRolledDetail } from "../events/DiceRolledEvent";
import { InitiativeRoll } from "../types/RollType";
import { isDefined } from "../utils/types";
import styles from "./EventLog.module.scss";
import useTimeout from "./hooks/useTimeout";
import {
  getAbilityCheckMessage,
  getAttackMessage,
  getCastMessage,
  getDamageMessage,
  getDeathMessage,
  getEffectAddedMessage,
  getEffectRemovedMessage,
  getExhaustionMessage,
  getHealedMessage,
  getInitiativeMessage,
  getSaveMessage,
  MessagePart,
} from "./utils/messages";

function LogMessage({ message }: { message: MessagePart[] }) {
  const text = message
    .filter(isDefined)
    .map((x) => (typeof x === "string" ? x : x.text))
    .join("");
  const children = message
    .filter(isDefined)
    .map((x) => (typeof x === "string" ? x : x.element));

  return (
    <li aria-label={text} className={styles.messageWrapper}>
      <div aria-hidden="true" className={styles.message}>
        {children}
      </div>
    </li>
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
      addMessage(<LogMessage message={getAttackMessage(detail)} />),
    );
    g.events.on("CombatantDamaged", ({ detail }) =>
      addMessage(<LogMessage message={getDamageMessage(detail)} />),
    );
    g.events.on("CombatantHealed", ({ detail }) =>
      addMessage(<LogMessage message={getHealedMessage(detail)} />),
    );
    g.events.on("CombatantDied", ({ detail }) =>
      addMessage(<LogMessage message={getDeathMessage(detail)} />),
    );
    g.events.on("EffectAdded", ({ detail }) => {
      if (!detail.effect.quiet)
        addMessage(<LogMessage message={getEffectAddedMessage(detail)} />);
    });
    g.events.on("EffectRemoved", ({ detail }) => {
      if (!detail.effect.quiet)
        addMessage(<LogMessage message={getEffectRemovedMessage(detail)} />);
    });
    g.events.on("SpellCast", ({ detail }) =>
      addMessage(<LogMessage message={getCastMessage(detail)} />),
    );
    g.events.on("DiceRolled", ({ detail }) => {
      if (detail.type.type === "initiative")
        addMessage(
          <LogMessage
            message={getInitiativeMessage(
              detail as DiceRolledDetail<InitiativeRoll>,
            )}
          />,
        );
    });
    g.events.on("AbilityCheck", ({ detail }) =>
      addMessage(<LogMessage message={getAbilityCheckMessage(detail)} />),
    );
    g.events.on("Save", ({ detail }) =>
      addMessage(<LogMessage message={getSaveMessage(detail)} />),
    );
    g.events.on("Exhaustion", ({ detail }) =>
      addMessage(<LogMessage message={getExhaustionMessage(detail)} />),
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
