import { BattleTemplateImage } from "../../data/BattleTemplate";
import { CSSProperties, useMemo } from "../lib";
import { scale } from "../utils/state";
import styles from "./BackgroundImage.module.scss";

export default function BackgroundImage({
  url,
  x,
  y,
  width,
  height,
  zIndex,
}: BattleTemplateImage) {
  const style = useMemo<CSSProperties>(
    () => ({
      left: x * scale.value,
      top: y * scale.value,
      width: width ? width * 5 * scale.value : undefined,
      height: height ? height * 5 * scale.value : undefined,
      zIndex,
    }),
    [x, y, width, height, zIndex, scale.value],
  );

  return (
    <img
      alt=""
      role="presentation"
      src={url}
      className={styles.image}
      style={style}
    />
  );
}
