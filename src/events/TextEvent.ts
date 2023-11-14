import MessageBuilder from "../MessageBuilder";

export interface TextDetail {
  message: MessageBuilder;
}

export default class TextEvent extends CustomEvent<TextDetail> {
  constructor(detail: TextDetail) {
    super("Text", { detail });
  }
}
