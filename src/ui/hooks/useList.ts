import { useCallback, useState } from "preact/hooks";

export default function useList<T>(initialValue: T[] = []) {
  const [list, setList] = useState(initialValue);

  const toggle = useCallback(
    (item: T) =>
      setList((old) =>
        old.includes(item) ? old.filter((x) => x !== item) : old.concat(item)
      ),
    []
  );

  return { list, setList, toggle };
}
