import allPCs, { PCName } from "../../data/allPCs";
import CombatantTile from "./CombatantTile";
import Dialog from "./Dialog";
import SearchableList, { ListItem } from "./SearchableList";

const pcItems = Object.entries(allPCs).map<ListItem<PCName>>(([key, t]) => ({
  value: key as PCName,
  component: <CombatantTile name={t.name} tokenUrl={t.tokenUrl} />,
}));

interface Props {
  onCancel(): void;
  onChoose(name: PCName): void;
}

export default function AddPCDialog({ onCancel, onChoose }: Props) {
  return (
    <Dialog title="Add Monster">
      <SearchableList items={pcItems} setValue={onChoose} />
      <button onClick={onCancel}>Cancel</button>
    </Dialog>
  );
}
