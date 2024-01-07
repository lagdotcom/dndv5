declare const MODE: "build" | "watch" | "test";

interface Window {
  g: import("./Engine").default;
  state: import("./ui/utils/state").UIState;
}
