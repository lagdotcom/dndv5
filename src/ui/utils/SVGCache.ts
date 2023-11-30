import { createContext } from "../lib";

export default interface SVGCache {
  get(src: string): Promise<string>;
}

export class FetchCache implements SVGCache {
  cache: Map<string, Promise<string>>;

  constructor(public init?: RequestInit) {
    this.cache = new Map();
  }

  get(src: string) {
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
