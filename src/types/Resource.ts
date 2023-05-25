export default interface Resource {
  refresh: "longRest" | "shortRest" | "turnStart";
  name: string;
  maximum: number;
}
