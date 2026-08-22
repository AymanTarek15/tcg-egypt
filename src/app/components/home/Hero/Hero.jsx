import Link from "next/link";
import styles from "./Hero.module.css";
import Container from "../../layout/Container/Container";

export default function Hero({ cards = [] }) {
  const heroCards = cards.slice(0, 5);

  return (
    <section className={styles.hero}>
      <div className={styles.glow} aria-hidden="true" />
      <div className={styles.gridBg} aria-hidden="true" />

      <Container>
        <div className={styles.content}>
          <div className={styles.text}>
            <span className={styles.badge}>
              <span className={styles.dot} /> Yu-Gi-Oh Marketplace · Egypt
            </span>
            <h1 className={styles.title}>
              Buy, sell, and track the{" "}
              <span className={styles.accent}>Yu-Gi-Oh</span> scene in Egypt
            </h1>
            <p className={styles.subtitle}>
              Browse thousands of cards, follow the meta, and trade with
              collectors across Egypt — all in one place.
            </p>

            <div className={styles.actions}>
              <Link href="/cards" className={styles.primaryBtn}>
                Browse Cards
              </Link>
              <Link href="/sell" className={styles.secondaryBtn}>
                Start Selling
              </Link>
            </div>

            <div className={styles.stats}>
              <div className={styles.stat}>
                <strong>13,000+</strong>
                <span>Cards indexed</span>
              </div>
              <div className={styles.statDivider} />
              <div className={styles.stat}>
                <strong>Live</strong>
                <span>Market prices</span>
              </div>
              <div className={styles.statDivider} />
              <div className={styles.stat}>
                <strong>Egypt</strong>
                <span>Local sellers</span>
              </div>
            </div>
          </div>

          {heroCards.length > 0 && (
            <div className={styles.showcase} aria-hidden="true">
              <div className={styles.fan}>
                {heroCards.map((card, i) => {
                  const offset = i - Math.floor(heroCards.length / 2);
                  return (
                  <div
                    key={card.id ?? i}
                    className={styles.fanCard}
                    style={{
                      "--i": i,
                      "--rot": `${offset * 13}deg`,
                      "--ty": `${Math.abs(offset) * 15}px`,
                    }}
                  >
                    <img
                      src={card.main_image || card.images?.[0]?.image_url}
                      alt=""
                      loading="eager"
                    />
                  </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}
