import Source from "./Source";

export default interface Resource extends Source {
  refresh: "longRest" | "never" | "shortRest" | "turnStart";
  maximum: number;
}
