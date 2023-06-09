const promiseCache = new Map<string, Promise<string>>();
export default async function cachedFetch(src: string, init?: RequestInit) {
  const cached = promiseCache.get(src);
  if (cached) return cached;

  const promise = fetch(src, init).then((r) => r.text());
  promiseCache.set(src, promise);
  return promise;
}
