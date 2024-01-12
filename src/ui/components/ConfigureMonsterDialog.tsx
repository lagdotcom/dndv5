import allMonsters, { MonsterName } from "../../data/allMonsters";
import MonsterTemplate from "../../data/MonsterTemplate";
import Engine from "../../Engine";
import { useMemo } from "../lib";
import ConfigComponents from "./ConfigComponents";
import Dialog from "./Dialog";

interface Props<T extends object> {
  g: Engine;
  name: MonsterName;
  config: T;
  onFinished(): void;
  patchConfig(key: string, value: unknown): void;
}

export default function ConfigureMonsterDialog<T extends object>({
  g,
  name,
  config,
  onFinished,
  patchConfig,
}: Props<T>) {
  const getConfig = useMemo(() => {
    const t = allMonsters[name] as MonsterTemplate<T>;
    if (!t.config) throw new Error(`Monster ${name} has no config`);
    return t.config.get;
  }, [name]);

  return (
    <Dialog title="Configure Monster">
      <ConfigComponents
        config={config}
        getConfig={(partial) => getConfig(g, partial)}
        patchConfig={patchConfig}
      />
      <button onClick={onFinished}>OK</button>
    </Dialog>
  );
}
