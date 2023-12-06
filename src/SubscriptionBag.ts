import { Unsubscribe } from "./events/Dispatcher";

export default class SubscriptionBag {
  set: Set<Unsubscribe>;

  constructor(...items: Unsubscribe[]) {
    this.set = new Set(items);
  }

  add(...items: Unsubscribe[]) {
    for (const item of items) this.set.add(item);
    return this;
  }

  cleanup() {
    for (const cleanup of this.set) cleanup();
    this.set.clear();
    return this;
  }
}
