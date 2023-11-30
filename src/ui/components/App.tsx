import { useMemo, useState } from "preact/hooks";

import BattleTemplate from "../../data/BattleTemplate";
import { daviesVsFiends } from "../../data/templates";
import Engine from "../../Engine";
import useBool from "../hooks/useBool";
import styles from "./App.module.scss";
import CombatUI from "./CombatUI";
import EditUI from "./EditUI";

export default function App() {
  const g = useMemo(() => {
    const engine = new Engine();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).g = engine;

    return engine;
  }, []);

  const [editing, , , toggleMode] = useBool(true);
  const [template, setTemplate] = useState<BattleTemplate>(daviesVsFiends);

  return (
    <main className={styles.container}>
      {editing ? (
        <EditUI g={g} template={template} onUpdate={setTemplate} />
      ) : (
        <CombatUI g={g} template={template} />
      )}
      <button
        onClick={toggleMode}
        className={styles.modeSwitch}
        disabled={template.combatants.length < 1}
      >
        {editing ? "Play" : "Edit"}
      </button>
    </main>
  );
}
