import Source from "../types/Source";

type ErrorEntry = { value: string; source: Source };

export default class ErrorCollector {
  errors: Set<ErrorEntry>;
  ignored: Set<Source>;

  constructor() {
    this.errors = new Set();
    this.ignored = new Set();
  }

  add(value: string, source: Source) {
    this.errors.add({ value, source });
  }

  ignore(source: Source) {
    this.ignored.add(source);
  }

  get valid() {
    return [...this.errors].filter((entry) => !this.ignored.has(entry.source));
  }

  get messages() {
    return this.valid.map((entry) => `${entry.value} (${entry.source.name})`);
  }

  get result() {
    return this.valid.length === 0;
  }
}
