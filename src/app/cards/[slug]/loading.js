import Container from "@/app/components/layout/Container/Container";
import styles from "./Loading.module.css";

export default function Loading() {
  return (
    <section className={styles.page}>
      <Container>
        <div className={styles.cardSection}>
          <div className={styles.image} />
          <div className={styles.info}>
            <div className={`${styles.line} ${styles.w40}`} />
            <div className={`${styles.line} ${styles.title}`} />
            <div className={styles.badges}>
              <div className={styles.badge} />
              <div className={styles.badge} />
            </div>
            <div className={`${styles.line} ${styles.w90}`} />
            <div className={`${styles.line} ${styles.w80}`} />
            <div className={`${styles.line} ${styles.w60}`} />
            <div className={styles.metaGrid}>
              <div className={styles.metaCard} />
              <div className={styles.metaCard} />
              <div className={styles.metaCard} />
              <div className={styles.metaCard} />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
