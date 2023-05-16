export const make = document.createElement.bind(document);

type EventHandlers<T> = {
  [K in keyof HTMLElementEventMap]: (
    this: T,
    e: HTMLElementEventMap[K]
  ) => unknown;
};

export function configure<T extends HTMLElement>(
  element: T,
  patch: Partial<T>,
  events: Partial<EventHandlers<T>> = {}
) {
  Object.assign(element, patch);
  for (const name of Object.keys(events))
    element.addEventListener(
      name,
      events[name as keyof typeof events] as EventListenerOrEventListenerObject
    );
  return element;
}

export function getStyleProperty(property: string, defaultValue: string) {
  return (
    window
      .getComputedStyle(document.documentElement)
      .getPropertyValue(property) || defaultValue
  );
}

export function getStylePropertyNumber(property: string, defaultValue: number) {
  const raw = getStyleProperty(property, px(defaultValue)).trim();
  return Number(raw.endsWith("px") ? raw.slice(0, -2) : raw);
}

export function px(size: number) {
  return `${size}px` as const;
}
