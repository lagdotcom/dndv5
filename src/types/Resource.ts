import Source from "./Source";

export default interface Resource extends Source {
  refresh: "dawn" | "longRest" | "never" | "shortRest" | "turnStart";
  maximum: number;
}
