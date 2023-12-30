declare const MODE: "build" | "watch" | "test";

interface Window {
  g: import("./Engine").Engine;
  state: import("./ui/utils/state").UIState;
}
