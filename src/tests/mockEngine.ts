import InterruptionCollector from "../collectors/InterruptionCollector";
import DndRules from "../DndRules";
import type Engine from "../Engine";
import mockDispatcher from "./mockDispatcher";

export default function mockEngine() {
  const g = {
    events: mockDispatcher(),

    fire<T>(e: CustomEvent<T>) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if ((e as any).detail.interrupt)
        throw new Error(
          `Use Engine.resolve() on an interruptible event type: ${e.type}`,
        );

      this.events.fire(e);
      return e;
    },

    async resolve<T extends { interrupt: InterruptionCollector }>(
      e: CustomEvent<T>,
    ) {
      this.events.fire(e);

      for (const interruption of e.detail.interrupt)
        await interruption.apply(this);

      return e;
    },
  } as Engine;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (g as any).DndRules = new DndRules(g);

  return g;
}
