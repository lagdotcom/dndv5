import allMonsters, { MonsterName } from "../../data/allMonsters";
import CombatantTile from "./CombatantTile";
import Dialog from "./Dialog";
import SearchableList, { ListItem } from "./SearchableList";

const monsterNames = Object.entries(allMonsters)
  .sort(([, a], [, b]) => a.name.localeCompare(b.name))
  .map<ListItem<MonsterName>>(([key, t]) => ({
    value: key as MonsterName,
    component: <CombatantTile name={t.name} tokenUrl={t.tokenUrl} />,
  }));

interface Props {
  onCancel(): void;
  onChoose(name: MonsterName): void;
}

export default function AddMonsterDialog({ onCancel, onChoose }: Props) {
  return (
    <Dialog title="Add Monster">
      <SearchableList items={monsterNames} setValue={onChoose} />
      <button onClick={onCancel}>Cancel</button>
    </Dialog>
  );
}
