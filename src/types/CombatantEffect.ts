import Source from "./Source";

export default interface CombatantEffect extends Source {
  durationTimer: "turnStart" | "turnEnd";
  quiet: boolean;
}
