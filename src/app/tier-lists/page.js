
import { tierListData } from "../components/home/data/dummyData";
import Container from "../components/layout/Container/Container";
import SectionTitle from "../shared/sectionTitle/SectionTitle";
import styles from "./TierListsPage.module.css";

export default function TierListsPage() {
  return (
    <section className={styles.page}>
      <Container>
        <SectionTitle
          title="Tier Lists"
          subtitle="A snapshot of top-performing decks in the current format."
        />

        <div className={styles.list}>
          {tierListData.map((group) => (
            <div key={group.tier} className={styles.card}>
              <div className={styles.tier}>{group.tier}</div>
              <div className={styles.decks}>
                {group.decks.map((deck) => (
                  <span key={deck} className={styles.deck}>
                    {deck}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}