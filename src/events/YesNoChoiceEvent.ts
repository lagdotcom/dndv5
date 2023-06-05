import YesNoChoice from "../interruptions/YesNoChoice";

export interface YesNoChoiceDetail {
  interruption: YesNoChoice;
  resolve(choice: boolean): void;
}

export default class YesNoChoiceEvent extends CustomEvent<YesNoChoiceDetail> {
  constructor(detail: YesNoChoiceDetail) {
    super("YesNoChoice", { detail });
  }
}
