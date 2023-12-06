import { Unsubscribe } from "./events/Dispatcher";

export default class UnsubscribeBag {
  set: Set<Unsubscribe>;

  constructor(...items: Unsubscribe[]) {
    this.set = new Set(items);
  }

  add(item: Unsubscribe) {
    this.set.add(item);
    return this;
  }

  cleanup() {
    for (const cleanup of this.set) cleanup();
    this.set.clear();
    return this;
  }
}
