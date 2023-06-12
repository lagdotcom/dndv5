import MultiListChoice from "../interruptions/MultiListChoice";

export interface MultiListChoiceDetail<T> {
  interruption: MultiListChoice<T>;
  resolve(choice: T[]): void;
}

export default class MultiListChoiceEvent<T = unknown> extends CustomEvent<
  MultiListChoiceDetail<T>
> {
  constructor(detail: MultiListChoiceDetail<T>) {
    super("MultiListChoice", { detail });
  }
}
