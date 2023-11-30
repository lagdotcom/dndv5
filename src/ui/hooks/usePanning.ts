import { useCallback, useState } from "../lib";

export default function usePanning(
  onPan: (dx: number, dy: number) => void,
  onHover?: (e: MouseEvent) => void,
) {
  const [isPanning, setIsPanning] = useState(false);
  const [panStartCoords, setPanStartCoords] = useState({ x: 0, y: 0 });

  const onMouseDown = useCallback((e: MouseEvent) => {
    if (e.button === 2) {
      // Right mouse button is held down
      setIsPanning(true);
      setPanStartCoords({ x: e.clientX, y: e.clientY });
    }
  }, []);

  const onMouseEnter = useCallback((e: MouseEvent) => {
    if (!e.button) setIsPanning(false);
  }, []);

  const onMouseMove = useCallback(
    (e: MouseEvent) => {
      if (isPanning) {
        const deltaX = e.clientX - panStartCoords.x;
        const deltaY = e.clientY - panStartCoords.y;
        onPan(-deltaX, -deltaY);
        setPanStartCoords({ x: e.clientX, y: e.clientY });
      } else onHover?.(e);
    },
    [isPanning, onHover, onPan, panStartCoords.x, panStartCoords.y],
  );

  const onMouseUp = useCallback(() => {
    setIsPanning(false);
  }, []);

  return {
    isPanning,
    onMouseDown,
    onMouseEnter,
    onMouseMove,
    onMouseUp,
  };
}
