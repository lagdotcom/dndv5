import type Dispatcher from "../events/Dispatcher";

type CallbackLike = (e: unknown) => void;

export default function mockDispatcher() {
  const handlers = new Map<string, CallbackLike[]>();

  return {
    on(type, callback: CallbackLike) {
      const list = handlers.get(type) ?? [];
      if (!handlers.has(type)) handlers.set(type, list);

      list.push(callback);
      return () => {
        list.splice(list.indexOf(callback), 1);
      };
    },
    fire(e) {
      const list = handlers.get(e.type) ?? [];
      for (const callback of list) callback(e);
    },
  } as Dispatcher;
}
