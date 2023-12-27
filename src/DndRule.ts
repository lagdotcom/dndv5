import Engine from "./Engine";
import Source from "./types/Source";

export const RuleRepository = new Set<DndRule>();

export default class DndRule implements Source {
  constructor(
    public name: string,
    public setup: (g: Engine) => void,
  ) {
    RuleRepository.add(this);
  }
}
