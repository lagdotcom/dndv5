import Source from "../types/Source";
import SumCollector from "../types/SumCollector";

interface CollectorEntry<T> {
  value: T;
  source: Source;
}

export default abstract class AbstractCollector<T> implements SumCollector<T> {
  entries: Set<CollectorEntry<T>>;
  ignored: Set<Source>;

  constructor() {
    this.entries = new Set();
    this.ignored = new Set();
  }

  add(value: T, source: Source): void {
    this.entries.add({ value, source });
  }

  ignore(source: Source): void {
    this.ignored.add(source);
  }

  involved(source: Source): boolean {
    if (this.ignored.has(source)) return false;
    for (const entry of this.entries) if (entry.source === source) return true;
    return false;
  }

  getValidEntries() {
    return [...this.entries]
      .filter((entry) => !this.ignored.has(entry.source))
      .map((entry) => entry.value);
  }

  abstract getResult(values: T[]): T;

  get result() {
    return this.getResult(this.getValidEntries());
  }
}
