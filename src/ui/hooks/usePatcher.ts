import { PatcherAccepter, producer } from "../../utils/immutable";
import { useState } from "../lib";

export default function usePatcher<T extends object>(
  initialState: T,
): [T, PatcherAccepter<T>] {
  const [state, setState] = useState(initialState);

  const patchState: PatcherAccepter<T> = (patcher) =>
    setState(producer(patcher));

  return [state, patchState];
}
