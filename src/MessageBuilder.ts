import Combatant from "./types/Combatant";
import Item from "./types/Item";

interface CombatantMessagePart {
  type: "combatant";
  value: Combatant;
  overrideName?: string;
  spaceBefore: boolean;
  spaceAfter: boolean;
}

interface ItemMessagePart {
  type: "item";
  value: Item;
}

interface TextMessagePart {
  type: "text";
  value: string;
}

export type MessagePart =
  | CombatantMessagePart
  | ItemMessagePart
  | TextMessagePart;

export default class MessageBuilder {
  data: MessagePart[];
  spaceBeforeNext: boolean;

  constructor() {
    this.data = [];
    this.spaceBeforeNext = false;
  }

  co(value: Combatant, overrideName?: string): this {
    this.data.push({
      type: "combatant",
      value,
      overrideName,
      spaceBefore: this.spaceBeforeNext,
      spaceAfter: true,
    });

    this.spaceBeforeNext = false;
    return this;
  }

  sp(): this {
    this.spaceBeforeNext = true;
    return this;
  }

  nosp(): this {
    const prev = this.data.at(-1);
    if (prev?.type === "combatant") prev.spaceAfter = false;

    return this;
  }

  it(value: Item): this {
    this.data.push({ type: "item", value });
    return this;
  }

  text(value: string): this {
    this.data.push({ type: "text", value });
    return this;
  }
}
