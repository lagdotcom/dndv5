import Collector from "../types/Collector";
import Source from "../types/Source";
import { SetInitialiser } from "../utils/set";

interface CollectorEntry<T> {
  value: T;
  source: Source;
}

class CollectorBase<T> {
  protected entries: Set<CollectorEntry<T>>;
  protected ignoredSources: Set<Source>;
  protected ignoredValues: Set<T>;
  protected completelyIgnored: boolean;

  constructor(
    entries?: SetInitialiser<CollectorEntry<T>>,
    ignoredSources?: SetInitialiser<Source>,
    ignoredValues?: SetInitialiser<T>,
  ) {
    this.completelyIgnored = false;
    this.entries = new Set(entries);
    this.ignoredSources = new Set(ignoredSources);
    this.ignoredValues = new Set(ignoredValues);
  }

  add(value: T, source: Source) {
    this.entries.add({ value, source });
  }

  ignore(source: Source) {
    this.ignoredSources.add(source);
  }

  ignoreValue(value: T) {
    this.ignoredValues.add(value);
  }

  ignoreAll() {
    this.completelyIgnored = true;
  }

  isInvolved(source: Source) {
    if (this.completelyIgnored) return false;
    if (this.ignoredSources.has(source)) return false;
    for (const entry of this.entries)
      if (entry.source === source && !this.ignoredValues.has(entry.value))
        return true;
    return false;
  }

  isIgnored(entry: CollectorEntry<T>) {
    return (
      this.completelyIgnored ||
      this.ignoredSources.has(entry.source) ||
      this.ignoredValues.has(entry.value)
    );
  }

  getTaggedEntries() {
    return Array.from(this.entries).map((entry) => ({
      entry,
      ignored: this.isIgnored(entry),
    }));
  }

  getEntries() {
    return Array.from(this.entries).filter((entry) => !this.isIgnored(entry));
  }

  getValues() {
    return this.getEntries().map((entry) => entry.value);
  }
}

export abstract class AbstractSumCollector<TValue, TResult = TValue>
  extends CollectorBase<TValue>
  implements Collector<TValue, TResult>
{
  abstract getSum(values: TValue[]): TResult;

  get result() {
    return this.getSum(this.getValues());
  }
}

export class SetCollector<T>
  extends CollectorBase<T>
  implements Collector<T, Set<T>>
{
  get result() {
    return new Set(this.getValues());
  }
}
