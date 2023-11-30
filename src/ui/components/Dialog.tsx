import { ComponentChildren, useEffect, useId, useRef } from "../lib";
import classnames from "../utils/classnames";
import styles from "./Dialog.module.scss";

interface Props {
  title: string;
  text: string;
  children: ComponentChildren;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function HTML5Dialog({ title, text, children }: Props) {
  const titleId = useId();
  const ref = useRef<HTMLDialogElement | null>(null);
  useEffect(() => ref.current?.showModal(), []);

  return (
    <dialog ref={ref} aria-labelledby={titleId} className={styles.main}>
      <div id={titleId} className={styles.title}>
        {title}
      </div>
      <p className={styles.text}>{text}</p>

      {children}
    </dialog>
  );
}

function ReactDialog({ title, text, children }: Props) {
  const titleId = useId();

  return (
    <div className={styles.shade}>
      <div
        role="dialog"
        aria-labelledby={titleId}
        aria-modal="true"
        className={classnames(styles.main, styles.react)}
      >
        <div id={titleId} className={styles.title}>
          {title}
        </div>
        <p className={styles.text}>{text}</p>

        {children}
      </div>
    </div>
  );
}

export default function Dialog(props: Props) {
  // TODO one day swap over to HTML5Dialog when it works with the tests

  return <ReactDialog {...props} />;
}
