declare module "*.png" {
  const url: import("./flavours").Url;
  export default url;
}

declare module "*.svg" {
  const url: import("./flavours").Url;
  export default url;
}
