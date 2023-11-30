import { useCallback, useState } from "preact/hooks";

import { MenuItem, MenuProps } from "../components/Menu";
import useBool from "./useBool";

export default function useMenu<T, C = never>(
  caption: string,
  clicked: (item: T, context: C) => void,
) {
  const [isShown, showMenu, hideMenu] = useBool(false);
  const [, setContext] = useState<C>();

  const hide = useCallback(() => {
    setContext(undefined);
    hideMenu();
  }, [hideMenu]);

  const onClick = useCallback(
    (item: T) => {
      hideMenu();
      setContext((context) => {
        clicked(item, context as C);
        return undefined;
      });
    },
    [clicked, hideMenu],
  );

  const [props, setProps] = useState<MenuProps<T>>({
    x: NaN,
    y: NaN,
    items: [],
    caption,
    onClick,
  });

  const show = useCallback(
    (e: MouseEvent, items: MenuItem<T>[], ctx?: C) => {
      showMenu();
      setProps({ x: e.clientX, y: e.clientY, items, caption, onClick });
      setContext(ctx);
    },
    [caption, onClick, showMenu],
  );

  return {
    isShown,
    props,
    show,
    hide,
  };
}
