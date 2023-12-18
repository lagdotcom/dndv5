import Engine from "../../Engine";
import { isDefined } from "../../utils/types";
import useTimeout from "../hooks/useTimeout";
import { useCallback, useEffect, useRef, useState, VNode } from "../lib";
import {
  getAbilityCheckMessage,
  getAttackInfo,
  getAttackMessage,
  getBuilderMessage,
  getCastMessage,
  getDamageMessage,
  getDeathMessage,
  getEffectAddedMessage,
  getEffectRemovedMessage,
  getExhaustionMessage,
  getHealedMessage,
  getInitiativeInfo,
  getInitiativeMessage,
  getSaveInfo,
  getSaveMessage,
  MessagePart,
} from "../utils/messages";
import UIResponse from "../utils/UIResponse";
import styles from "./EventLog.module.scss";

function LogMessage({
  message,
  info,
}: {
  message: MessagePart[];
  info?: string;
}) {
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
      {info && (
        <div className={styles.info} title={info}>
          ...
        </div>
      )}
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
      detail.interrupt.add(
        new UIResponse(detail.pre.who, async () =>
          addMessage(
            <LogMessage
              message={getAttackMessage(detail)}
              info={getAttackInfo(detail)}
            />,
          ),
        ),
      ),
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
    g.events.on("CombatantInitiative", ({ detail }) => {
      addMessage(
        <LogMessage
          message={getInitiativeMessage(detail)}
          info={getInitiativeInfo(detail)}
        />,
      );
    });
    g.events.on("AbilityCheck", ({ detail }) =>
      addMessage(<LogMessage message={getAbilityCheckMessage(detail)} />),
    );
    g.events.on("Save", ({ detail }) =>
      addMessage(
        <LogMessage
          message={getSaveMessage(detail)}
          info={getSaveInfo(detail)}
        />,
      ),
    );
    g.events.on("Exhaustion", ({ detail }) =>
      addMessage(<LogMessage message={getExhaustionMessage(detail)} />),
    );
    g.events.on("Text", ({ detail }) =>
      addMessage(<LogMessage message={getBuilderMessage(detail.message)} />),
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
