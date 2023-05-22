import Source from "../types/Source";

type ErrorEntry = { value: string; source: Source };

export default class ErrorCollector {
  errors: Set<ErrorEntry>;

  constructor() {
    this.errors = new Set();
  }

  add(value: string, source: Source) {
    this.errors.add({ value, source });
  }

  get messages() {
    return [...this.errors].map(
      (entry) => `${entry.value} (${entry.source.name})`
    );
  }

  get valid() {
    return this.errors.size === 0;
  }
}
