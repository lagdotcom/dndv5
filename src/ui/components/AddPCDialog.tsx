import allPCs, { PCName } from "../../data/allPCs";
import Dialog from "./Dialog";
import SearchableList from "./SearchableList";

interface Props {
  onCancel(): void;
  onChoose(name: PCName): void;
}

const pcNames = Object.keys(allPCs) as PCName[];

export default function AddPCDialog({ onCancel, onChoose }: Props) {
  return (
    <Dialog title="Add Monster">
      <SearchableList items={pcNames} setValue={onChoose} />
      <button onClick={onCancel}>Cancel</button>
    </Dialog>
  );
}
