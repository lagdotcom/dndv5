import Interruption from "../types/Interruption";

export default class InterruptionCollector {
  private set: Set<Interruption>;

  constructor() {
    this.set = new Set();
  }

  add(interrupt: Interruption) {
    this.set.add(interrupt);
  }

  *[Symbol.iterator]() {
    const interruptions = [...this.set];
    interruptions.sort((a, b) => b.priority - a.priority);
    for (const interruption of interruptions) yield interruption;
  }
}
