import { useCallback, useEffect, useState } from "preact/hooks";

export default function useTimeout(handler: () => void, ms = undefined) {
  const [handle, setHandle] = useState<ReturnType<typeof setTimeout>>();

  const fire = useCallback(
    () =>
      setHandle((old) => {
        if (old) return old;
        return setTimeout(() => {
          setHandle(undefined);
          handler();
        }, ms);
      }),
    [handler, ms],
  );

  const cancel = useCallback(
    () =>
      setHandle((old) => {
        if (old) clearTimeout(old);
        return undefined;
      }),
    [],
  );

  useEffect(() => cancel, [cancel]);

  return { cancel, fire, handle };
}
