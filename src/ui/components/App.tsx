import BattleTemplate from "../../data/BattleTemplate";
import { daviesVsFiends } from "../../data/templates";
import Engine from "../../Engine";
import useBool from "../hooks/useBool";
import usePatcher from "../hooks/usePatcher";
import { useMemo } from "../lib";
import styles from "./App.module.scss";
import CombatUI from "./CombatUI";
import EditUI from "./EditUI";

export default function App() {
  const g = useMemo(() => {
    const engine = new Engine();
    window.g = engine;
    return engine;
  }, []);

  const [editing, , , toggleMode] = useBool(true);
  const [template, onUpdate] = usePatcher<BattleTemplate>(daviesVsFiends);

  return (
    <main className={styles.container}>
      {editing ? (
        <EditUI g={g} template={template} onUpdate={onUpdate} />
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
