import Link from "next/link";
// import Container from "@/components/layout/Container/Container";
import styles from "./Hero.module.css";
import Container from "../../layout/Container/Container";

export default function Hero() {
  return (
    <section className={styles.hero}>
      <Container>
        <div className={styles.content}>
          <div>
            <span className={styles.badge}>Yu-Gi-Oh Marketplace Egypt</span>
            <h1>Buy, sell, and track the Yu-Gi-Oh scene in Egypt</h1>
            <p>
              Discover card listings, follow tier lists, and stay updated with
              meta changes and community news.
            </p>

            <div className={styles.actions}>
              <Link href="/cards" className={styles.primaryBtn}>
                Browse Cards
              </Link>
              <Link href="/sell" className={styles.secondaryBtn}>
                Start Selling
              </Link>
            </div>
          </div>

          {/* <div className={styles.panel}>
            <h3>Today’s highlights</h3>
            <ul>
              <li>Featured listings</li>
              <li>Top decks this week</li>
              <li>Latest card market trends</li>
              <li>New local tournament updates</li>
            </ul>
          </div> */}
        </div>
      </Container>
    </section>
  );
}