import PickFromListChoice from "../interruptions/PickFromListChoice";

export interface ListChoiceDetail<T> {
  interruption: PickFromListChoice<T>;
  resolve(choice?: T): void;
}

export default class ListChoiceEvent<T = unknown> extends CustomEvent<
  ListChoiceDetail<T>
> {
  constructor(detail: ListChoiceDetail<T>) {
    super("ListChoice", { detail });
  }
}
