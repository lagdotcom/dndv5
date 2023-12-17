import allMonsters, { MonsterName } from "../../data/allMonsters";
import Dialog from "./Dialog";
import SearchableList from "./SearchableList";

interface Props {
  onCancel(): void;
  onChoose(name: MonsterName): void;
}

const monsterNames = Object.keys(allMonsters) as MonsterName[];

export default function AddMonsterDialog({ onCancel, onChoose }: Props) {
  return (
    <Dialog title="Add Monster">
      <SearchableList items={monsterNames} setValue={onChoose} />
      <button onClick={onCancel}>Cancel</button>
    </Dialog>
  );
}
