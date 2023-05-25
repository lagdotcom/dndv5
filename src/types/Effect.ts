import Source from "./Source";

export default interface Effect extends Source {
  durationTimer: "turnStart" | "turnEnd";
}
