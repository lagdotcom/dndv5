import Source from "./Source";

export default interface Resource extends Source {
  refresh: "longRest" | "shortRest" | "turnStart";
  maximum: number;
}
