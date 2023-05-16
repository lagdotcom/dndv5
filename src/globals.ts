import CssSizeVariable from "./CssSizeVariable";
import Observable from "./Observable";

export const busy = new Observable(false);

export const moveButtonSize = new CssSizeVariable("--movebtn-size", 30);
export const scale = new CssSizeVariable("--scale", 100);
