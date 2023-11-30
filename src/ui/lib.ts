import { JSXInternal } from "preact/src/jsx";

export { batch, computed, signal } from "@preact/signals";
export { ComponentChildren, createContext, render, VNode } from "preact";
export {
  StateUpdater,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "preact/hooks";

export type AriaRole = JSXInternal.AriaRole;
export type CSSProperties = JSXInternal.CSSProperties;
export type TargetedEvent<
  Target extends EventTarget = EventTarget,
  TypedEvent extends Event = Event,
> = JSXInternal.TargetedEvent<Target, TypedEvent>;
