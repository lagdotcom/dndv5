import Collector from "../types/Collector";
import Source from "../types/Source";
import { SetInitialiser } from "../utils/set";

interface CollectorEntry<T> {
  value: T;
  source: Source;
}

abstract class AbstractCollector<T> {
  entries: Set<CollectorEntry<T>>;
  ignoredSources: Set<Source>;
  ignoredValues: Set<T>;

  constructor(
    entries?: SetInitialiser<CollectorEntry<T>>,
    ignoredSources?: SetInitialiser<Source>,
    ignoredValues?: SetInitialiser<T>,
  ) {
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

  isInvolved(source: Source): boolean {
    if (this.ignoredSources.has(source)) return false;
    for (const entry of this.entries)
      if (entry.source === source && !this.ignoredValues.has(entry.value))
        return true;
    return false;
  }

  getValidEntries() {
    return Array.from(this.entries)
      .filter(
        (entry) =>
          !(
            this.ignoredSources.has(entry.source) ||
            this.ignoredValues.has(entry.value)
          ),
      )
      .map((entry) => entry.value);
  }
}

export abstract class AbstractSumCollector<TValue, TResult = TValue>
  extends AbstractCollector<TValue>
  implements Collector<TValue, TResult>
{
  abstract getSum(values: TValue[]): TResult;

  get result() {
    return this.getSum(this.getValidEntries());
  }
}

export class SetCollector<T>
  extends AbstractCollector<T>
  implements Collector<T, Set<T>>
{
  get result() {
    return new Set(this.getValidEntries());
  }
}
