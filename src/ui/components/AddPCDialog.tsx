import allPCs, { PCName } from "../../data/allPCs";
import { objectEntries } from "../../utils/objects";
import CombatantTile from "./CombatantTile";
import Dialog from "./Dialog";
import SearchableList, { ListItem } from "./SearchableList";

const pcItems = objectEntries(allPCs)
  .sort(([, a], [, b]) => a.name.localeCompare(b.name))
  .map<ListItem<PCName>>(([value, t]) => ({
    value,
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
