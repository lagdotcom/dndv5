import { BattleTemplateImage } from "../../data/BattleTemplate";
import { Pixels } from "../../flavours";
import { MapSquareSize } from "../../MapSquare";
import { CSSProperties, useMemo } from "../lib";
import styles from "./BackgroundImage.module.scss";

interface Props {
  image: BattleTemplateImage;
  scaleValue: Pixels;
}

export default function BackgroundImage({
  image: { src, x, y, width, height, zIndex },
  scaleValue,
}: Props) {
  const style = useMemo<CSSProperties>(
    () => ({
      left: x * scaleValue,
      top: y * scaleValue,
      width: width ? width * MapSquareSize * scaleValue : undefined,
      height: height ? height * MapSquareSize * scaleValue : undefined,
      zIndex,
    }),
    [height, scaleValue, width, x, y, zIndex],
  );

  return (
    <img
      alt=""
      role="presentation"
      src={src}
      className={styles.image}
      style={style}
    />
  );
}
