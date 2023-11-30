import { useState } from "preact/hooks";

export default function useBool(
  defaultValue = false,
): [
  value: boolean,
  setTrue: () => void,
  setFalse: () => void,
  toggle: () => void,
] {
  const [value, setValue] = useState(defaultValue);

  const setTrue = () => setValue(true);
  const setFalse = () => setValue(false);
  const toggle = () => setValue((old) => !old);

  return [value, setTrue, setFalse, toggle];
}
