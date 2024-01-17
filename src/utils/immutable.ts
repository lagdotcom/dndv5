import { clone } from "./objects";

export type StatePatcher<T> = (state: T) => void;
export type PatcherAccepter<T> = (patcher: StatePatcher<T>) => void;

export const producer =
  <T extends object>(patcher: StatePatcher<T>) =>
  (old: T) => {
    const newObj = clone(old);
    patcher(newObj);
    return newObj;
  };
