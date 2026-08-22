import styles from "./CardSkeleton.module.css";

export function CardSkeleton() {
  return (
    <div className={styles.card} aria-hidden="true">
      <div className={styles.image} />
      <div className={styles.info}>
        <div className={`${styles.line} ${styles.lineTitle}`} />
        <div className={`${styles.line} ${styles.lineType}`} />
        <div className={styles.pill} />
        <div className={styles.button} />
      </div>
    </div>
  );
}

export default function CardSkeletonGrid({ count = 12 }) {
  return (
    <div className={styles.grid} aria-hidden="true">
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}
