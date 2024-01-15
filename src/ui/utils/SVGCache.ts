import { Html, Url } from "../../flavours";
import { createContext } from "../lib";

export default interface SVGCache {
  get(src: Url): Promise<Html>;
}

export class FetchCache implements SVGCache {
  cache: Map<Url, Promise<Html>>;

  constructor(public init?: RequestInit) {
    this.cache = new Map();
  }

  get(src: Url): Promise<Html> {
    const cached = this.cache.get(src);
    if (cached) return cached;

    const promise = fetch(src, this.init).then((r) => r.text());
    this.cache.set(src, promise);
    return promise;
  }
}

export const SVGCacheContext = createContext<SVGCache>({
  get() {
    throw new Error("Missing SVGCacheContext.Provider");
  },
});
