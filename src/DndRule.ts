import Engine from "./Engine";

export const RuleRepository = new Set<DndRule>();

export default class DndRule {
  constructor(
    public name: string,
    public setup: (g: Engine) => void,
  ) {
    RuleRepository.add(this);
  }
}
