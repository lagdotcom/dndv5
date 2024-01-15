import { ErrorMessage } from "../flavours";
import Source from "../types/Source";

interface ErrorEntry {
  value: ErrorMessage;
  source: Source;
}

export default class ErrorCollector {
  errors: Set<ErrorEntry>;
  ignored: Set<Source>;

  constructor() {
    this.errors = new Set();
    this.ignored = new Set();
  }

  add(value: ErrorMessage, source: Source) {
    this.errors.add({ value, source });
  }

  addMany(messages: ErrorMessage[], source: Source) {
    for (const message of messages) this.add(message, source);
  }

  ignore(source: Source) {
    this.ignored.add(source);
  }

  get valid() {
    return Array.from(this.errors).filter(
      (entry) => !this.ignored.has(entry.source),
    );
  }

  get messages() {
    return this.valid.map((entry) => `${entry.value} (${entry.source.name})`);
  }

  get result() {
    return this.valid.length === 0;
  }
}
